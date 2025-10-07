---
title: "MySQL 쿼리 성능 최적화 가이드"
date: "2025-10-07"
category: "Database"
subcategory: "MySQL"
tags: ["MySQL", "Database", "Performance", "Optimization"]
excerpt: "MySQL 쿼리 성능을 향상시키는 다양한 최적화 기법과 인덱스 전략을 알아봅니다."
author: "Geon Lee"
---

# MySQL 쿼리 성능 최적화 가이드

MySQL 데이터베이스의 성능을 최적화하는 것은 애플리케이션 전체 성능에 큰 영향을 미칩니다.

## 인덱스 (Index)

### 인덱스 생성

```sql
-- 단일 컬럼 인덱스
CREATE INDEX idx_email ON users(email);

-- 복합 인덱스
CREATE INDEX idx_name_age ON users(name, age);

-- 유니크 인덱스
CREATE UNIQUE INDEX idx_username ON users(username);

-- 전문 검색 인덱스
CREATE FULLTEXT INDEX idx_content ON posts(content);
```

### 인덱스 사용 원칙

```sql
-- ✅ 좋은 예: 인덱스 활용
SELECT * FROM users WHERE email = 'john@example.com';

-- ❌ 나쁜 예: 인덱스 사용 불가 (함수 사용)
SELECT * FROM users WHERE UPPER(email) = 'JOHN@EXAMPLE.COM';

-- ✅ 개선: 인덱스 활용 가능
SELECT * FROM users WHERE email = LOWER('JOHN@EXAMPLE.COM');
```

## EXPLAIN을 활용한 쿼리 분석

```sql
EXPLAIN SELECT * FROM users WHERE age > 20;
```

### 주요 컬럼 해석

- **type**: 조인 타입 (ALL, index, range, ref, eq_ref, const)
  - ALL: 전체 테이블 스캔 (피해야 함)
  - index: 인덱스 전체 스캔
  - range: 인덱스 범위 스캔
  - ref: 인덱스를 사용한 동등 비교
  - const: 기본 키나 유니크 키로 단일 행 접근

- **key**: 실제 사용된 인덱스
- **rows**: 검사할 예상 행 수 (적을수록 좋음)
- **Extra**: 추가 정보
  - Using filesort: 정렬 필요 (인덱스로 개선 가능)
  - Using temporary: 임시 테이블 사용 (피해야 함)
  - Using index: 커버링 인덱스 사용 (좋음)

## 쿼리 최적화 기법

### 1. SELECT * 피하기

```sql
-- ❌ 나쁜 예
SELECT * FROM users WHERE id = 1;

-- ✅ 좋은 예
SELECT id, name, email FROM users WHERE id = 1;
```

### 2. WHERE 조건 최적화

```sql
-- ❌ 나쁜 예: 인덱스 사용 불가
SELECT * FROM users WHERE age + 10 > 30;

-- ✅ 좋은 예: 인덱스 사용 가능
SELECT * FROM users WHERE age > 20;

-- ❌ 나쁜 예: LIKE 앞에 %
SELECT * FROM users WHERE name LIKE '%john%';

-- ✅ 좋은 예: LIKE 뒤에만 %
SELECT * FROM users WHERE name LIKE 'john%';
```

### 3. JOIN 최적화

```sql
-- ❌ 나쁜 예: 서브쿼리
SELECT * FROM users 
WHERE id IN (SELECT user_id FROM orders WHERE total > 100);

-- ✅ 좋은 예: JOIN 사용
SELECT DISTINCT u.* 
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.total > 100;
```

### 4. 페이징 최적화

```sql
-- ❌ 나쁜 예: OFFSET이 클 때 느림
SELECT * FROM posts 
ORDER BY created_at DESC
LIMIT 100 OFFSET 100000;

-- ✅ 좋은 예: 키 기반 페이징
SELECT * FROM posts 
WHERE id < :last_id
ORDER BY id DESC
LIMIT 100;
```

### 5. COUNT 최적화

```sql
-- ❌ 나쁜 예: 전체 행 카운트
SELECT COUNT(*) FROM users;

-- ✅ 좋은 예: 조건이 있는 경우 인덱스 활용
SELECT COUNT(*) FROM users WHERE status = 'active';

-- 더 좋은 방법: 근사치 사용
SELECT TABLE_ROWS 
FROM information_schema.TABLES 
WHERE TABLE_NAME = 'users';
```

## 복합 인덱스 최적화

### 인덱스 컬럼 순서

```sql
-- 인덱스: (city, age, name)
-- ✅ 인덱스 사용: city 사용
SELECT * FROM users WHERE city = 'Seoul';

-- ✅ 인덱스 사용: city, age 사용
SELECT * FROM users WHERE city = 'Seoul' AND age > 20;

-- ✅ 인덱스 완전 사용
SELECT * FROM users WHERE city = 'Seoul' AND age > 20 AND name = 'John';

-- ❌ 인덱스 사용 불가: city 없음
SELECT * FROM users WHERE age > 20 AND name = 'John';
```

### 커버링 인덱스

```sql
-- 인덱스: (email, name, age)
-- 커버링 인덱스: 테이블 접근 없이 인덱스만으로 결과 반환
SELECT name, age FROM users WHERE email = 'john@example.com';
```

## 파티셔닝

### Range 파티셔닝

```sql
CREATE TABLE orders (
    id INT,
    order_date DATE,
    amount DECIMAL(10, 2)
)
PARTITION BY RANGE (YEAR(order_date)) (
    PARTITION p2022 VALUES LESS THAN (2023),
    PARTITION p2023 VALUES LESS THAN (2024),
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

### List 파티셔닝

```sql
CREATE TABLE users (
    id INT,
    name VARCHAR(100),
    country VARCHAR(50)
)
PARTITION BY LIST COLUMNS(country) (
    PARTITION p_asia VALUES IN ('Korea', 'Japan', 'China'),
    PARTITION p_america VALUES IN ('USA', 'Canada'),
    PARTITION p_europe VALUES IN ('UK', 'Germany', 'France')
);
```

## 트랜잭션 최적화

### 1. 트랜잭션 범위 최소화

```sql
-- ❌ 나쁜 예: 긴 트랜잭션
START TRANSACTION;
SELECT * FROM users WHERE id = 1 FOR UPDATE;
-- 복잡한 비즈니스 로직 처리...
UPDATE users SET balance = balance - 100 WHERE id = 1;
COMMIT;

-- ✅ 좋은 예: 짧은 트랜잭션
-- 비즈니스 로직 먼저 처리
START TRANSACTION;
UPDATE users SET balance = balance - 100 WHERE id = 1;
COMMIT;
```

### 2. 적절한 격리 수준

```sql
-- READ COMMITTED (기본값 대체)
SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- REPEATABLE READ (MySQL 기본값)
SET SESSION TRANSACTION ISOLATION LEVEL REPEATABLE READ;
```

## 캐싱 전략

### 쿼리 캐시 (MySQL 5.7 이하)

```sql
-- 쿼리 캐시 사용
SELECT SQL_CACHE * FROM users WHERE id = 1;

-- 쿼리 캐시 미사용
SELECT SQL_NO_CACHE * FROM users WHERE id = 1;
```

### 애플리케이션 레벨 캐싱

```javascript
// Redis 캐싱 예제
async function getUser(id) {
  const cacheKey = `user:${id}`;
  
  // 캐시 확인
  let user = await redis.get(cacheKey);
  
  if (!user) {
    // DB 조회
    user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    // 캐시 저장 (10분)
    await redis.setex(cacheKey, 600, JSON.stringify(user));
  }
  
  return JSON.parse(user);
}
```

## 벌크 작업 최적화

### INSERT 최적화

```sql
-- ❌ 나쁜 예: 개별 INSERT
INSERT INTO users (name, email) VALUES ('John', 'john@example.com');
INSERT INTO users (name, email) VALUES ('Jane', 'jane@example.com');

-- ✅ 좋은 예: 벌크 INSERT
INSERT INTO users (name, email) VALUES 
('John', 'john@example.com'),
('Jane', 'jane@example.com'),
('Bob', 'bob@example.com');
```

### UPDATE 최적화

```sql
-- ❌ 나쁜 예: 불필요한 UPDATE
UPDATE users SET updated_at = NOW();

-- ✅ 좋은 예: 조건을 통한 최소화
UPDATE users SET updated_at = NOW() WHERE status = 'active';
```

## 데이터베이스 설정 최적화

### my.cnf 주요 설정

```ini
[mysqld]
# InnoDB 버퍼 풀 (물리 메모리의 70-80%)
innodb_buffer_pool_size = 4G

# 로그 파일 크기
innodb_log_file_size = 256M

# 최대 연결 수
max_connections = 200

# 쿼리 캐시 (MySQL 8.0 제거됨)
query_cache_size = 0
query_cache_type = 0

# 정렬 버퍼
sort_buffer_size = 2M

# 조인 버퍼
join_buffer_size = 2M
```

## 모니터링

### 느린 쿼리 로그

```sql
-- 활성화
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- 로그 확인
SELECT * FROM mysql.slow_log 
ORDER BY start_time DESC 
LIMIT 10;
```

### 실시간 쿼리 확인

```sql
SHOW PROCESSLIST;

-- 또는
SELECT * FROM information_schema.PROCESSLIST 
WHERE COMMAND != 'Sleep';
```

## 결론

MySQL 성능 최적화는 지속적인 모니터링과 개선이 필요합니다.
인덱스를 적절히 설계하고, 쿼리를 최적화하며, 시스템 설정을 조정하면 극적인 성능 향상을 얻을 수 있습니다! 🚀

