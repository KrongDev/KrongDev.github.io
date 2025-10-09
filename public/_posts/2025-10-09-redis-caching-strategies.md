---
title: "Redis 캐싱 전략 완벽 가이드"
date: "2025-10-09"
category: "Database"
subcategory: "Redis"
tags: ["Redis", "Cache", "Performance", "In-Memory"]
excerpt: "Redis를 활용한 효과적인 캐싱 전략과 실전 패턴을 배워 애플리케이션 성능을 극대화합니다."
author: "Geon Lee"
---

# Redis 캐싱 전략 완벽 가이드

Redis는 인메모리 데이터 구조 저장소로, 캐싱, 세션 관리, 실시간 분석 등에 널리 사용됩니다.

## Redis란?

**REmote DIctionary Server**의 약자로, 고성능 키-값 저장소입니다.

### 주요 특징

- ⚡ **빠른 성능**: 메모리 기반으로 마이크로초 단위 응답
- 🔄 **다양한 자료구조**: String, List, Set, Hash, Sorted Set 등
- 💾 **영속성**: 데이터를 디스크에 저장 가능
- 🔁 **복제**: Master-Slave 복제 지원
- ⚖️ **확장성**: Redis Cluster로 수평 확장

## 기본 명령어

### String 타입

```bash
# 저장
SET user:1 "John"
SET user:1 "John" EX 3600  # 1시간 TTL

# 조회
GET user:1

# 증가/감소
INCR counter
DECR counter
INCRBY counter 5

# 여러 키 한번에
MSET user:1 "John" user:2 "Jane"
MGET user:1 user:2
```

### Hash 타입

```bash
# 사용자 객체 저장
HSET user:1 name "John" age 30 email "john@example.com"

# 특정 필드 조회
HGET user:1 name

# 전체 조회
HGETALL user:1

# 필드 존재 확인
HEXISTS user:1 name
```

### List 타입

```bash
# 추가 (왼쪽/오른쪽)
LPUSH queue "task1"
RPUSH queue "task2"

# 제거 및 반환
LPOP queue
RPOP queue

# 범위 조회
LRANGE queue 0 -1

# 길이
LLEN queue
```

### Set 타입

```bash
# 추가
SADD tags "javascript" "nodejs" "redis"

# 멤버 확인
SISMEMBER tags "javascript"

# 전체 조회
SMEMBERS tags

# 집합 연산
SUNION tags1 tags2      # 합집합
SINTER tags1 tags2      # 교집합
SDIFF tags1 tags2       # 차집합
```

### Sorted Set 타입

```bash
# 추가 (스코어와 함께)
ZADD leaderboard 100 "player1"
ZADD leaderboard 200 "player2"

# 순위 조회 (오름차순)
ZRANGE leaderboard 0 -1 WITHSCORES

# 순위 조회 (내림차순)
ZREVRANGE leaderboard 0 9 WITHSCORES

# 특정 멤버 스코어
ZSCORE leaderboard "player1"

# 순위 (0부터 시작)
ZRANK leaderboard "player1"
```

## 캐싱 전략

### 1. Cache-Aside (Lazy Loading)

애플리케이션이 캐시를 직접 관리하는 패턴입니다.

```javascript
async function getUser(id) {
  const cacheKey = `user:${id}`;
  
  // 1. 캐시 확인
  let user = await redis.get(cacheKey);
  
  if (user) {
    return JSON.parse(user);
  }
  
  // 2. DB 조회
  user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  
  // 3. 캐시 저장
  await redis.setex(cacheKey, 3600, JSON.stringify(user));
  
  return user;
}
```

**장점**: 필요한 데이터만 캐싱  
**단점**: 초기 요청은 느림 (Cache Miss)

### 2. Write-Through

데이터를 쓸 때 캐시와 DB를 동시에 업데이트합니다.

```javascript
async function updateUser(id, data) {
  const cacheKey = `user:${id}`;
  
  // 1. DB 업데이트
  await db.query('UPDATE users SET ? WHERE id = ?', [data, id]);
  
  // 2. 캐시 업데이트
  const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  await redis.setex(cacheKey, 3600, JSON.stringify(user));
  
  return user;
}
```

**장점**: 데이터 일관성 보장  
**단점**: 쓰기 성능 저하

### 3. Write-Behind (Write-Back)

캐시만 업데이트하고, DB는 비동기로 업데이트합니다.

```javascript
async function updateUser(id, data) {
  const cacheKey = `user:${id}`;
  
  // 1. 캐시 업데이트
  const user = { ...data, id };
  await redis.setex(cacheKey, 3600, JSON.stringify(user));
  
  // 2. DB 업데이트 작업 큐에 추가
  await queue.add('updateUserDB', { id, data });
  
  return user;
}
```

**장점**: 빠른 쓰기 성능  
**단점**: 데이터 유실 가능성

### 4. Refresh-Ahead

만료 전에 미리 갱신하는 패턴입니다.

```javascript
async function getUser(id) {
  const cacheKey = `user:${id}`;
  
  let user = await redis.get(cacheKey);
  const ttl = await redis.ttl(cacheKey);
  
  // TTL이 10분 미만이면 백그라운드에서 갱신
  if (ttl < 600) {
    refreshUserCache(id);  // 비동기 실행
  }
  
  if (user) {
    return JSON.parse(user);
  }
  
  // Cache Miss 시 동기 로딩
  return await loadAndCacheUser(id);
}
```

## 캐시 무효화 전략

### 1. TTL (Time To Live)

```javascript
// 1시간 후 자동 만료
await redis.setex('user:1', 3600, JSON.stringify(user));

// 특정 시간에 만료
const expiresAt = new Date('2024-12-31 23:59:59');
const ttl = Math.floor((expiresAt - Date.now()) / 1000);
await redis.setex('promotion', ttl, data);
```

### 2. 명시적 삭제

```javascript
// 단일 키 삭제
await redis.del('user:1');

// 패턴 매칭 삭제
const keys = await redis.keys('user:*');
if (keys.length > 0) {
  await redis.del(...keys);
}

// SCAN을 사용한 안전한 삭제
let cursor = '0';
do {
  const [newCursor, keys] = await redis.scan(
    cursor, 
    'MATCH', 'user:*', 
    'COUNT', 100
  );
  cursor = newCursor;
  if (keys.length > 0) {
    await redis.del(...keys);
  }
} while (cursor !== '0');
```

### 3. 태그 기반 무효화

```javascript
// 사용자와 관련된 모든 캐시에 태그 추가
await redis.sadd('tag:user:1', 'user:1:profile');
await redis.sadd('tag:user:1', 'user:1:orders');
await redis.sadd('tag:user:1', 'user:1:cart');

// 태그로 한번에 무효화
async function invalidateUserCache(userId) {
  const tag = `tag:user:${userId}`;
  const keys = await redis.smembers(tag);
  
  if (keys.length > 0) {
    await redis.del(...keys);
    await redis.del(tag);
  }
}
```

## 실전 패턴

### 1. 세션 관리

```javascript
// 세션 저장 (7일)
await redis.setex(
  `session:${sessionId}`,
  7 * 24 * 60 * 60,
  JSON.stringify({
    userId: 1,
    username: 'john',
    loginAt: new Date()
  })
);

// 세션 조회
const session = await redis.get(`session:${sessionId}`);

// 세션 갱신
await redis.expire(`session:${sessionId}`, 7 * 24 * 60 * 60);
```

### 2. Rate Limiting

```javascript
async function checkRateLimit(userId, limit = 100, window = 60) {
  const key = `rate_limit:${userId}`;
  
  // 현재 카운트 증가
  const count = await redis.incr(key);
  
  // 첫 요청이면 TTL 설정
  if (count === 1) {
    await redis.expire(key, window);
  }
  
  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetIn: await redis.ttl(key)
  };
}
```

### 3. 리더보드

```javascript
// 점수 추가/업데이트
await redis.zadd('leaderboard:2024', score, userId);

// 상위 10명
const top10 = await redis.zrevrange('leaderboard:2024', 0, 9, 'WITHSCORES');

// 특정 사용자 순위
const rank = await redis.zrevrank('leaderboard:2024', userId);

// 주변 순위 조회
const myRank = await redis.zrevrank('leaderboard:2024', userId);
const around = await redis.zrevrange(
  'leaderboard:2024',
  Math.max(0, myRank - 5),
  myRank + 5,
  'WITHSCORES'
);
```

### 4. 분산 락

```javascript
async function acquireLock(lockKey, timeout = 10) {
  const value = Date.now() + timeout * 1000;
  
  // NX: key가 없을 때만, PX: 밀리초 단위 TTL
  const acquired = await redis.set(
    lockKey,
    value,
    'NX',
    'PX',
    timeout * 1000
  );
  
  return acquired === 'OK';
}

async function releaseLock(lockKey) {
  await redis.del(lockKey);
}

// 사용 예
const locked = await acquireLock('order:123');
if (locked) {
  try {
    // 임계 영역 작업
    await processOrder(123);
  } finally {
    await releaseLock('order:123');
  }
}
```

### 5. Pub/Sub

```javascript
// Publisher
await redis.publish('notifications', JSON.stringify({
  type: 'new_message',
  userId: 123,
  message: 'Hello!'
}));

// Subscriber
const subscriber = redis.duplicate();
await subscriber.subscribe('notifications');

subscriber.on('message', (channel, message) => {
  const data = JSON.parse(message);
  console.log('Received:', data);
});
```

## 성능 최적화

### 1. Pipeline

```javascript
// 여러 명령을 한번에 전송
const pipeline = redis.pipeline();
pipeline.set('key1', 'value1');
pipeline.set('key2', 'value2');
pipeline.get('key1');
const results = await pipeline.exec();
```

### 2. 적절한 자료구조 선택

```javascript
// ❌ 나쁜 예: String으로 객체 저장
await redis.set('user:1', JSON.stringify({ name: 'John', age: 30 }));

// ✅ 좋은 예: Hash 사용
await redis.hset('user:1', 'name', 'John', 'age', 30);
```

### 3. 메모리 최적화

```yaml
# redis.conf
maxmemory 2gb
maxmemory-policy allkeys-lru  # LRU 정책으로 메모리 관리
```

## 결론

Redis는 단순한 캐시를 넘어 세션, 큐, 실시간 분석 등 다양한 용도로 활용할 수 있는 강력한 도구입니다.
적절한 캐싱 전략과 자료구조를 선택하면 애플리케이션 성능을 획기적으로 향상시킬 수 있습니다! 🚀

