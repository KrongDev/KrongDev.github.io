---
title: "Platform MSA에서의 분산 트랜잭션 설계"
date: "2025-11-05"
category: "Platform"
subcategory: "MSA"
tags: ["MSA", "Distributed Transaction", "Saga", "TCC", "Outbox", "Idempotency", "Kafka", "Spring"]
excerpt: "마이크로서비스 환경에서 데이터 일관성을 보장하기 위한 분산 트랜잭션 전략과 실무 패턴을 정리합니다."
author: "Geon Lee"
---

# Platform MSA 분산 트랜잭션, 왜 어렵고 어떻게 풀까

대규모 플랫폼에서 서비스가 쪼개질수록(서비스 경계 분리) 데이터 일관성 문제는 정면으로 마주하게 됩니다. 전통적인 단일 DB 트랜잭션은 더 이상 통하지 않습니다. 이 글은 실무자의 관점에서 분산 트랜잭션을 다루며 선택의 근거를 다룹니다.

 ![](/_images/2025-11-05/msa-distributed-architecture.svg)

---

## 1. 기본기 정리: ACID vs BASE, CAP 관점에서 보기

### ACID vs BASE

- ACID: Strong Consistency 기반. 단일 DB 트랜잭션에 적합
- BASE: Basically Available, Soft state, Eventual consistency. 대규모 분산 시스템에서 현실적인 선택

핵심은 "업무적으로 허용 가능한 지연 일관성의 범위"를 정의하는 것입니다. 어떤 도메인은 강한 일관성이 필요(결제 승인/취소), 어떤 도메인은 최종 일관성으로 충분(알림, 포인트 적립)합니다.

 ![](/_images/2025-11-05/acid-base.svg)

 보다 구체히:

- ACID는 트랜잭션 단위로 강한 보장을 제공하되, 분산 환경에서는 전역 락/대기 등으로 성능과 가용성이 떨어질 수 있습니다.
- BASE는 지연 일관성을 전제로 도메인 정책(보상, 재시도, 멱등성)으로 비즈니스 일관성을 달성합니다.

### CAP 간단 리마인드

- C(일관성) - A(가용성) - P(분할 내성) 중 네트워크 파티션 상황에서 C 또는 A를 선택해야 함
- 대부분의 인터넷 규모 시스템은 P가 기본 가정 → C와 A의 균형을 도메인 별로 설계

 ![](/_images/2025-11-05/cap-theorem.svg)

 해석 팁:

- 파티션 발생 시 CP 시스템은 쓰기/읽기를 제한하며 일관성을 보존, AP 시스템은 가용성을 유지하되 최종 일관성으로 수렴합니다.

---

## 2. 전통적 2PC/XA와 한계

### 2PC(2-Phase Commit)

- 장점: 개발 난이도 낮음(이론상)
- 단점: 전역 락과 블로킹, 코디네이터 단일 장애 지점, 성능 저하, 클라우드 네이티브 환경과 상성 나쁨

실무 결론: 대다수 MSA 환경에서는 2PC를 지양합니다.

 ![](/_images/2025-11-05/2pc-xa.svg)

 보충 설명:

- Phase 1(prepare): 각 리소스가 커밋 가능 여부 투표. Phase 2(commit/abort): 코디네이터가 최종 결정 전파.
- XA는 표준 인터페이스로 DB/메시지 리소스를 2PC에 참여시킬 수 있으나, 네트워크 이슈와 블로킹으로 운영 난도가 높습니다.

---

## 3. MSA에서 쓰는 패턴들: Saga, TCC, Outbox

### 3.1 Saga 패턴

- 사고방식: 긴 트랜잭션을 지역 트랜잭션들의 시퀀스로 분해하고, 실패 시 보상(Compensation)으로 롤백
- 두 가지 스타일
  - Choreography: 이벤트 기반 자율 흐름. 의존도 낮음, 서비스 수가 늘면 흐름 가시성이 떨어짐
  - Orchestration: 중앙 오케스트레이터가 단계 제어. 가시성 좋음, 오케스트레이터에 로직 집중

#### Choreography 예시(주문 → 결제 → 재고)

 ![](/_images/2025-11-05/saga-choreography.svg)

```java
// 주문 서비스: OrderCreated 이벤트 발행 (Transactional Outbox 사용 권장)
@Transactional
public Order placeOrder(CreateOrderCommand cmd) {
    Order order = orderRepository.save(Order.create(cmd));
    outboxRepository.save(OutboxMessage.of("OrderCreated", order.getId(), payload(order)));
    return order;
}
```

```java
// 결제 서비스: OrderCreated 구독 → 결제 승인 후 PaymentApproved 발행
@KafkaListener(topics = "order-created", groupId = "payment")
public void onOrderCreated(OrderCreated event) {
    Payment payment = paymentService.authorize(event.orderId(), event.amount());
    outboxRepository.save(OutboxMessage.of("PaymentApproved", event.orderId(), payload(payment)));
}
```

```java
// 재고 서비스: PaymentApproved 구독 → 재고 차감, 실패 시 보상 이벤트 발행
@KafkaListener(topics = "payment-approved", groupId = "inventory")
public void onPaymentApproved(PaymentApproved event) {
    try {
        inventoryService.reserve(event.orderId(), event.sku(), event.qty());
        outboxRepository.save(OutboxMessage.of("InventoryReserved", event.orderId(), payload(event)));
    } catch (InsufficientStockException e) {
        outboxRepository.save(OutboxMessage.of("InventoryReservationFailed", event.orderId(), payload(event)));
    }
}
```

#### Orchestration 예시(오케스트레이터 중심)

 ![](/_images/2025-11-05/saga-orchestration.svg)

```java
public class OrderSagaOrchestrator {
    public void start(OrderId orderId) {
        send(new AuthorizePayment(orderId));
    }

    public void on(PaymentAuthorized evt) {
        send(new ReserveInventory(evt.orderId()));
    }

    public void on(InventoryReserved evt) {
        send(new CompleteOrder(evt.orderId()));
    }

    public void on(InventoryReservationFailed evt) {
        send(new RefundPayment(evt.orderId())); // 보상
        send(new CancelOrder(evt.orderId()));
    }
}
```

언제 무엇을? 서비스 간 결합이 느슨하고 단계가 단순하면 Choreography, 업무 플로우가 복잡·가변적이면 Orchestration이 유리합니다.

### 3.2 TCC(Try-Confirm/Cancel)

 ![](/_images/2025-11-05/tcc-flow.svg)

- Try: 자원 잠금/임시 예약
- Confirm: 확정
- Cancel: 해제

결제, 좌석 예매처럼 강한 일관성과 잠금이 필요한 도메인에서 적합하지만, 구현 부담이 높습니다.

```java
// 좌석 서비스
public interface SeatReservationApi {
    ReservationId tryReserve(SeatId seatId, UserId userId, Duration ttl);
    void confirm(ReservationId id);
    void cancel(ReservationId id);
}
```

### 3.3 Transactional Outbox + Relay(또는 CDC)

 ![](/_images/2025-11-05/outbox-flow.svg)

동일 DB 트랜잭션에서 비즈니스 데이터와 이벤트를 함께 기록하고, 별도 릴레이가 이벤트 브로커(Kafka 등)로 전달합니다.

```sql
-- outbox 테이블 (필수 인덱스 포함)
CREATE TABLE outbox (
  id BIGSERIAL PRIMARY KEY,
  aggregate_type VARCHAR(100) NOT NULL,
  aggregate_id VARCHAR(100) NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  headers JSONB,
  occurred_at TIMESTAMP NOT NULL DEFAULT NOW(),
  published_at TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
);
CREATE INDEX idx_outbox_pending ON outbox (status, occurred_at);
```

```java
// 동일 트랜잭션에서 비즈니스 + outbox 기록
@Transactional
public void changeOrderStatus(OrderId id, OrderStatus next) {
    Order order = orderRepository.findByIdForUpdate(id);
    order.changeStatus(next);
    orderRepository.save(order);
    outboxRepository.save(OutboxMessage.of("OrderStatusChanged", id.value(), payload(order)));
}
```

```java
// 릴레이: PENDING → 브로커 발행 → PUBLISHED 업데이트 (정확히 한 번을 지향)
@Scheduled(fixedDelay = 200)
public void relay() {
    List<OutboxMessage> messages = outboxRepository.findPendingBatch(100);
    for (OutboxMessage m : messages) {
        kafkaTemplate.send(topic(m), key(m), m.payload());
        outboxRepository.markPublished(m.id());
    }
}
```

CDC(Debezium)로 binlog를 구독해 브로커로 내보내는 방식도 흔한 대안입니다.

---

## 4. 실무 설계 체크리스트

### 4.1 멱등성(Idempotency)

- 소비자: `messageId`/`dedupKey` 기반 처리 이력 저장 → 중복 수신에도 단 1회만 적용
- 생산자: Outbox로 재시도 시 중복 발행 방지

```java
public boolean handleOnce(String messageId, Supplier<Boolean> handler) {
    if (processedStore.exists(messageId)) return true;
    boolean ok = handler.get();
    if (ok) processedStore.save(messageId);
    return ok;
}
```

### 4.2 재시도와 독성 메시지(Dead Letter)

- 백오프 재시도(지수/선형), 최대 횟수 초과 시 DLQ
- DLQ는 반드시 운영 대시보드와 연결하여 수동 처리 루틴 제공

### 4.3 순서 보장

- Kafka 파티션 키 전략: 같은 집계 루트(예: `orderId`)는 동일 파티션으로
- 멱등 처리와 함께 사용하면 재처리에도 안전

### 4.4 트랜잭션 경계와 보상 정의

- 각 지역 트랜잭션은 빠르게 커밋, 보상은 "업무적으로 허용 가능한 역연산"을 명시
- 예) 포인트 적립 보상: 적립 취소 이벤트, 재고 보상: 예약 해제

```java
public class CompensationHandlers {
    public void onPaymentFailed(OrderId orderId) {
        send(new CancelInventoryReservation(orderId));
        send(new RevertPoint(orderId));
        send(new CancelOrder(orderId));
    }
}
```

### 4.5 관측성(Observability)

- Trace(분산 트레이싱), Metric(성공/실패율, 보상율), Log(상관관계 ID)
- OpenTelemetry + Kafka/Spring 통합으로 `traceId` 전파 필수

```java
// 메시지 헤더에 trace 컨텍스트 주입/추출
KafkaTemplate<String, String> template;

public void publish(String topic, String key, String payload) {
    try (var span = tracer.spanBuilder("publish:")
            .setSpanKind(SpanKind.PRODUCER)
            .startSpan()) {
        var headers = new RecordHeaders();
        propagator.inject(Context.current().with(span), headers, HeadersSetter.INSTANCE);
        template.send(new ProducerRecord<>(topic, null, key, payload, headers));
    }
}
```

---

## 5. 아키텍처 레퍼런스: 결제 중심 시나리오

1) 주문 생성 → 2) 결제 승인 → 3) 재고 예약 → 4) 주문 확정

- 주 데이터 흐름: Saga(Orchestration)
- 보조 데이터: Outbox + CDC로 분석 파이프라인에 전송
- 중요 도메인(결제)은 TCC로 Try-Confirm/Cancel 지원

설계 포인트

- 오케스트레이터는 상태 전이만 담당(업무 로직은 각 도메인)
- 모든 이벤트는 멱등 + 재시도 가능해야 함
- 실패율/보상율/지연시간을 대시보드화(운영 용이성)

---

## 6. 테스트 전략(실전)

### 계약 테스트(Consumer-Driven Contract)

- 이벤트 스키마와 의미론의 계약화(Pact, spring-cloud-contract)

### 통합 테스트(Testcontainers)

```java
@Testcontainers
class SagaFlowIT {
    @Container static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0"));

    @Test
    void endToEnd_succeeds_and_is_idempotent() {
        // given
        var orderId = UUID.randomUUID().toString();

        // when: 주문 생성 이벤트 2번 발행(중복)
        publish("order-created", orderId, payload(orderId));
        publish("order-created", orderId, payload(orderId));

        // then: 최종 상태는 1회만 반영되어야 함
        await().atMost(Duration.ofSeconds(10)).untilAsserted(() -> {
            assertThat(readOrderState(orderId)).isEqualTo("CONFIRMED");
            assertThat(processedCount("order-created", orderId)).isEqualTo(1);
        });
    }
}
```

---

## 7. 선택 가이드(요약)

- 강한 일관성 필요 + 잠금 가능: TCC 고려
- 흐름 복잡/가변 + 가시성 중시: Orchestration Saga
- 느슨한 결합 + 단순 단계: Choreography Saga
- 재시도/멱등/순서 보장 + 운영 용이성: Outbox(+CDC) 기본 채택

---

## 8. 운영 팁 모음

- 메시지 버전 관리: `event_type` + `schemaVersion`로 진화형 스키마 유지
- 보상 실패의 보상: 보상도 실패할 수 있으니 재시도와 관리자 경보 설계
- 부분 실패 모니터링: 보상율이 급증하면 상위 플로우 점검
- 핫 파티션 완화: 키 설계 시 샤딩 키 혼합(예: `orderId%N`) 고려

---

## 마치며

분산 트랜잭션은 하나의 은탄환이 없습니다. 도메인별 일관성 요구를 수치로 정의하고, Saga/TCC/Outbox/CDC를 적절히 조합해 운영 가능한 일관성을 확보하는 것이 핵심입니다. 이 글의 체크리스트와 코드 스니펫을 바탕으로, 여러분의 Platform MSA에서도 예측 가능하고 관측 가능한 데이터 일관성을 구현해 보시길 바랍니다.


