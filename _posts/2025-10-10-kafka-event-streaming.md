---
title: "Apache Kafka 이벤트 스트리밍 입문"
date: "2025-10-10"
category: "Platform"
subcategory: "Event Streaming"
tags: ["Kafka", "Event Streaming", "Message Queue", "Architecture"]
excerpt: "Apache Kafka를 활용한 이벤트 스트리밍 아키텍처의 기본 개념과 실전 활용법을 배웁니다."
author: "Geon Lee"
---

# Apache Kafka 이벤트 스트리밍 입문

Apache Kafka는 대용량 실시간 데이터 스트리밍을 처리하는 분산 이벤트 스트리밍 플랫폼입니다.

## Kafka란?

LinkedIn에서 개발한 오픈소스 분산 스트리밍 플랫폼으로, 높은 처리량과 낮은 지연시간을 제공합니다.

### 주요 특징

- 📊 **높은 처리량**: 초당 수백만 개의 메시지 처리
- 💾 **영속성**: 메시지를 디스크에 저장
- 🔄 **확장성**: 수평 확장 가능
- ⚡ **낮은 지연시간**: 밀리초 단위 응답
- 🔁 **복제**: 데이터 복제로 내결함성 보장

## 핵심 개념

### Topic (토픽)

메시지가 저장되는 카테고리/피드입니다.

```bash
# 토픽 생성
kafka-topics --create \
  --topic orders \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 2
```

### Partition (파티션)

토픽을 분할하여 병렬 처리를 가능하게 합니다.

```
Topic: orders
├── Partition 0: [msg1, msg4, msg7, ...]
├── Partition 1: [msg2, msg5, msg8, ...]
└── Partition 2: [msg3, msg6, msg9, ...]
```

### Producer (프로듀서)

메시지를 Kafka에 발행하는 애플리케이션입니다.

```javascript
// Node.js 프로듀서
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();

async function sendMessage() {
  await producer.connect();
  
  await producer.send({
    topic: 'orders',
    messages: [
      {
        key: 'order-123',
        value: JSON.stringify({
          orderId: 123,
          userId: 456,
          amount: 99.99,
          timestamp: new Date().toISOString()
        })
      }
    ]
  });
  
  await producer.disconnect();
}
```

### Consumer (컨슈머)

Kafka로부터 메시지를 읽는 애플리케이션입니다.

```javascript
const consumer = kafka.consumer({ groupId: 'order-service' });

async function consumeMessages() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'orders', fromBeginning: true });
  
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        key: message.key?.toString(),
        value: JSON.parse(message.value.toString())
      });
    }
  });
}
```

### Consumer Group (컨슈머 그룹)

여러 컨슈머가 하나의 그룹으로 메시지를 분산 처리합니다.

```
Consumer Group: order-service
├── Consumer 1 → Partition 0
├── Consumer 2 → Partition 1
└── Consumer 3 → Partition 2
```

## 메시지 전송 방식

### At Most Once (최대 한 번)

```javascript
producer.send({
  topic: 'orders',
  messages: [{ value: 'message' }],
  acks: 0  // 응답 기다리지 않음
});
```

### At Least Once (최소 한 번)

```javascript
producer.send({
  topic: 'orders',
  messages: [{ value: 'message' }],
  acks: 1  // 리더 파티션만 확인
});
```

### Exactly Once (정확히 한 번)

```javascript
const producer = kafka.producer({
  idempotent: true,
  transactionalId: 'my-transactional-id'
});

await producer.connect();

const transaction = await producer.transaction();
try {
  await transaction.send({
    topic: 'orders',
    messages: [{ value: 'message' }]
  });
  await transaction.commit();
} catch (error) {
  await transaction.abort();
}
```

## 실전 패턴

### 1. 이벤트 소싱 (Event Sourcing)

```javascript
// 주문 이벤트 발행
async function createOrder(order) {
  const events = [
    {
      type: 'OrderCreated',
      data: order,
      timestamp: new Date()
    },
    {
      type: 'InventoryReserved',
      data: { items: order.items },
      timestamp: new Date()
    },
    {
      type: 'PaymentProcessed',
      data: { amount: order.total },
      timestamp: new Date()
    }
  ];
  
  for (const event of events) {
    await producer.send({
      topic: 'order-events',
      messages: [{
        key: order.id,
        value: JSON.stringify(event)
      }]
    });
  }
}
```

### 2. CQRS (Command Query Responsibility Segregation)

```javascript
// Command (쓰기)
await producer.send({
  topic: 'user-commands',
  messages: [{
    value: JSON.stringify({
      command: 'UpdateUserProfile',
      userId: 123,
      data: { name: 'John', email: 'john@example.com' }
    })
  }]
});

// Query (읽기) - 별도 Read Model
const user = await readModelDb.getUser(123);
```

### 3. Change Data Capture (CDC)

```javascript
// Debezium을 사용한 DB 변경 감지
// MySQL 변경사항이 Kafka로 자동 전송됨
{
  "before": null,
  "after": {
    "id": 123,
    "name": "John",
    "email": "john@example.com"
  },
  "source": {
    "version": "1.9.7.Final",
    "connector": "mysql",
    "name": "mydb",
    "table": "users"
  },
  "op": "c",  // c: create, u: update, d: delete
  "ts_ms": 1678901234567
}
```

### 4. 사가 패턴 (Saga Pattern)

```javascript
// 분산 트랜잭션 관리
async function processOrder(order) {
  // 1. 주문 생성
  await producer.send({
    topic: 'order-saga',
    messages: [{
      value: JSON.stringify({
        saga: 'OrderSaga',
        step: 'CreateOrder',
        data: order
      })
    }]
  });
  
  // 각 마이크로서비스가 이벤트를 소비하고
  // 다음 단계 이벤트를 발행
}

// Saga Orchestrator
consumer.run({
  eachMessage: async ({ message }) => {
    const event = JSON.parse(message.value);
    
    switch (event.step) {
      case 'CreateOrder':
        // 재고 확인 요청
        await sendEvent('CheckInventory', event.data);
        break;
      case 'InventoryChecked':
        // 결제 요청
        await sendEvent('ProcessPayment', event.data);
        break;
      case 'PaymentProcessed':
        // 배송 요청
        await sendEvent('ArrangeShipping', event.data);
        break;
      // 실패 시 보상 트랜잭션
      case 'PaymentFailed':
        await sendEvent('ReleaseInventory', event.data);
        break;
    }
  }
});
```

## Kafka Streams

### 스트림 처리

```javascript
const { KafkaStreams } = require('kafka-streams');

const config = {
  kafkaHost: 'localhost:9092'
};

const streams = new KafkaStreams(config);

const stream = streams.getKStream('orders');

// 필터링
stream
  .filter(message => {
    const order = JSON.parse(message.value);
    return order.amount > 100;
  })
  .to('high-value-orders');

// 변환
stream
  .map(message => {
    const order = JSON.parse(message.value);
    return {
      ...message,
      value: JSON.stringify({
        orderId: order.id,
        total: order.amount * 1.1  // 세금 포함
      })
    };
  })
  .to('processed-orders');

// 집계
stream
  .groupByKey()
  .reduce(
    (acc, message) => {
      const order = JSON.parse(message.value);
      return {
        count: acc.count + 1,
        total: acc.total + order.amount
      };
    },
    { count: 0, total: 0 }
  )
  .to('order-statistics');
```

### Windowing (윈도우 연산)

```javascript
stream
  .window({
    type: 'tumbling',
    duration: 60000  // 1분
  })
  .groupByKey()
  .count()
  .to('orders-per-minute');
```

## 모니터링 및 관리

### Kafka Manager / AKHQ

```yaml
# docker-compose.yml
version: '3'
services:
  akhq:
    image: tchiotludo/akhq
    ports:
      - "8080:8080"
    environment:
      AKHQ_CONFIGURATION: |
        akhq:
          connections:
            kafka:
              properties:
                bootstrap.servers: "kafka:9092"
```

### Consumer Lag 모니터링

```bash
# Consumer Group의 Lag 확인
kafka-consumer-groups --bootstrap-server localhost:9092 \
  --group order-service \
  --describe
```

## 성능 최적화

### 1. 배치 처리

```javascript
const producer = kafka.producer({
  // 메시지를 모아서 한번에 전송
  'batch.size': 16384,
  'linger.ms': 10,
  'compression.type': 'snappy'
});
```

### 2. 파티션 키 설정

```javascript
// 동일한 키는 같은 파티션으로 전송
await producer.send({
  topic: 'orders',
  messages: [{
    key: order.userId.toString(),  // 사용자별로 순서 보장
    value: JSON.stringify(order)
  }]
});
```

### 3. 병렬 처리

```javascript
const consumer = kafka.consumer({
  groupId: 'order-service',
  // 여러 파티션을 병렬로 처리
  maxInFlightRequests: 5
});

await consumer.run({
  eachBatchAutoResolve: false,
  eachBatch: async ({
    batch,
    resolveOffset,
    heartbeat
  }) => {
    for (const message of batch.messages) {
      // 메시지 처리
      await processMessage(message);
      
      // 오프셋 커밋
      resolveOffset(message.offset);
      
      // 주기적으로 heartbeat
      await heartbeat();
    }
  }
});
```

## 에러 처리

### Dead Letter Queue (DLQ)

```javascript
consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    try {
      await processMessage(message);
    } catch (error) {
      console.error('Processing failed:', error);
      
      // DLQ로 전송
      await producer.send({
        topic: 'orders-dlq',
        messages: [{
          key: message.key,
          value: message.value,
          headers: {
            'original-topic': topic,
            'error-message': error.message,
            'retry-count': '1'
          }
        }]
      });
    }
  }
});
```

### Retry 전략

```javascript
async function processWithRetry(message, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await processMessage(message);
      return;
    } catch (error) {
      if (i === maxRetries - 1) {
        // 최종 실패 시 DLQ로
        await sendToDLQ(message, error);
      } else {
        // 지수 백오프
        await sleep(Math.pow(2, i) * 1000);
      }
    }
  }
}
```

## 결론

Apache Kafka는 대규모 이벤트 스트리밍을 위한 강력한 플랫폼입니다.
마이크로서비스 아키텍처에서 서비스 간 통신, 이벤트 소싱, 실시간 데이터 파이프라인 구축에 필수적인 도구입니다! 🚀

