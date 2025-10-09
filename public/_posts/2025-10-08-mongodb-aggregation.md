---
title: "MongoDB Aggregation Pipeline 마스터하기"
date: "2025-10-08"
category: "Database"
subcategory: "MongoDB"
tags: ["MongoDB", "Aggregation", "NoSQL", "Database"]
excerpt: "MongoDB의 강력한 기능인 Aggregation Pipeline을 활용하여 복잡한 데이터 처리를 수행하는 방법을 배웁니다."
author: "Geon Lee"
---

# MongoDB Aggregation Pipeline 마스터하기

MongoDB의 Aggregation Pipeline은 데이터를 단계별로 변환하고 분석할 수 있는 강력한 도구입니다.

## Aggregation Pipeline이란?

여러 단계(stage)를 거쳐 데이터를 처리하는 파이프라인 방식의 프레임워크입니다.

```javascript
db.collection.aggregate([
  { $match: { ... } },
  { $group: { ... } },
  { $sort: { ... } }
])
```

## 주요 Stage 연산자

### $match - 필터링

```javascript
// 특정 조건에 맞는 문서만 선택
db.orders.aggregate([
  {
    $match: {
      status: "completed",
      total: { $gte: 100 }
    }
  }
])
```

### $project - 필드 선택/변환

```javascript
db.users.aggregate([
  {
    $project: {
      _id: 0,
      name: 1,
      email: 1,
      age: 1,
      // 계산된 필드
      isAdult: { $gte: ["$age", 18] }
    }
  }
])
```

### $group - 그룹화 및 집계

```javascript
// 도시별 사용자 수와 평균 나이
db.users.aggregate([
  {
    $group: {
      _id: "$city",
      count: { $sum: 1 },
      averageAge: { $avg: "$age" },
      maxAge: { $max: "$age" },
      minAge: { $min: "$age" }
    }
  }
])
```

### $sort - 정렬

```javascript
db.orders.aggregate([
  {
    $sort: {
      total: -1,  // 내림차순
      date: 1     // 오름차순
    }
  }
])
```

### $limit와 $skip - 페이징

```javascript
db.products.aggregate([
  { $sort: { price: -1 } },
  { $skip: 20 },   // 20개 건너뛰기
  { $limit: 10 }   // 10개만 가져오기
])
```

### $lookup - JOIN

```javascript
// SQL의 LEFT JOIN과 유사
db.orders.aggregate([
  {
    $lookup: {
      from: "users",           // 조인할 컬렉션
      localField: "userId",    // orders의 필드
      foreignField: "_id",     // users의 필드
      as: "userInfo"          // 결과 필드명
    }
  }
])
```

### $unwind - 배열 분해

```javascript
// 배열 요소를 개별 문서로 분해
db.products.aggregate([
  {
    $unwind: "$tags"
  }
])

// 예시:
// 입력: { name: "Product", tags: ["a", "b", "c"] }
// 출력: 
// { name: "Product", tags: "a" }
// { name: "Product", tags: "b" }
// { name: "Product", tags: "c" }
```

## 실전 예제

### 1. 월별 매출 통계

```javascript
db.orders.aggregate([
  {
    $match: {
      status: "completed",
      orderDate: {
        $gte: new Date("2024-01-01"),
        $lt: new Date("2025-01-01")
      }
    }
  },
  {
    $group: {
      _id: {
        year: { $year: "$orderDate" },
        month: { $month: "$orderDate" }
      },
      totalRevenue: { $sum: "$total" },
      orderCount: { $sum: 1 },
      averageOrderValue: { $avg: "$total" }
    }
  },
  {
    $sort: { "_id.year": 1, "_id.month": 1 }
  },
  {
    $project: {
      _id: 0,
      year: "$_id.year",
      month: "$_id.month",
      totalRevenue: 1,
      orderCount: 1,
      averageOrderValue: { $round: ["$averageOrderValue", 2] }
    }
  }
])
```

### 2. 상위 10개 제품 분석

```javascript
db.orderItems.aggregate([
  {
    $group: {
      _id: "$productId",
      totalSold: { $sum: "$quantity" },
      totalRevenue: { $sum: { $multiply: ["$quantity", "$price"] } }
    }
  },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product"
    }
  },
  {
    $unwind: "$product"
  },
  {
    $project: {
      productName: "$product.name",
      category: "$product.category",
      totalSold: 1,
      totalRevenue: 1
    }
  },
  {
    $sort: { totalRevenue: -1 }
  },
  {
    $limit: 10
  }
])
```

### 3. 사용자 행동 분석

```javascript
db.events.aggregate([
  {
    $match: {
      eventType: { $in: ["click", "purchase"] }
    }
  },
  {
    $group: {
      _id: "$userId",
      clicks: {
        $sum: { $cond: [{ $eq: ["$eventType", "click"] }, 1, 0] }
      },
      purchases: {
        $sum: { $cond: [{ $eq: ["$eventType", "purchase"] }, 1, 0] }
      },
      totalSpent: {
        $sum: { $cond: [{ $eq: ["$eventType", "purchase"] }, "$amount", 0] }
      }
    }
  },
  {
    $project: {
      userId: "$_id",
      clicks: 1,
      purchases: 1,
      totalSpent: 1,
      conversionRate: {
        $cond: [
          { $gt: ["$clicks", 0] },
          { $multiply: [{ $divide: ["$purchases", "$clicks"] }, 100] },
          0
        ]
      }
    }
  },
  {
    $sort: { totalSpent: -1 }
  }
])
```

## 고급 연산자

### $facet - 다중 파이프라인

```javascript
db.products.aggregate([
  {
    $facet: {
      // 카테고리별 통계
      byCategory: [
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ],
      // 가격대별 통계
      byPriceRange: [
        {
          $bucket: {
            groupBy: "$price",
            boundaries: [0, 50, 100, 200, 500],
            default: "500+",
            output: { count: { $sum: 1 } }
          }
        }
      ],
      // 전체 통계
      stats: [
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            avgPrice: { $avg: "$price" },
            maxPrice: { $max: "$price" }
          }
        }
      ]
    }
  }
])
```

### $bucket - 범위별 그룹화

```javascript
db.users.aggregate([
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 20, 30, 40, 50, 60, 100],
      default: "Other",
      output: {
        count: { $sum: 1 },
        users: { $push: "$name" }
      }
    }
  }
])
```

### $addFields - 필드 추가

```javascript
db.orders.aggregate([
  {
    $addFields: {
      totalWithTax: {
        $multiply: ["$total", 1.1]
      },
      discountAmount: {
        $multiply: ["$total", { $divide: ["$discountPercent", 100] }]
      }
    }
  }
])
```

## 성능 최적화

### 1. $match를 최대한 앞쪽에 배치

```javascript
// ✅ 좋은 예
db.orders.aggregate([
  { $match: { status: "completed" } },  // 먼저 필터링
  { $lookup: { ... } },
  { $group: { ... } }
])

// ❌ 나쁜 예
db.orders.aggregate([
  { $lookup: { ... } },  // 많은 데이터로 JOIN
  { $match: { status: "completed" } }
])
```

### 2. 인덱스 활용

```javascript
// 인덱스 생성
db.orders.createIndex({ status: 1, orderDate: -1 })

// $match에서 인덱스 활용
db.orders.aggregate([
  {
    $match: {
      status: "completed",
      orderDate: { $gte: new Date("2024-01-01") }
    }
  }
])
```

### 3. $project로 필요한 필드만 선택

```javascript
db.users.aggregate([
  { $match: { ... } },
  {
    $project: {  // 필요한 필드만 선택
      name: 1,
      email: 1,
      age: 1
    }
  },
  { $group: { ... } }
])
```

### 4. allowDiskUse 옵션

```javascript
// 메모리 제한(100MB) 초과 시 디스크 사용
db.collection.aggregate(
  [ ... ],
  { allowDiskUse: true }
)
```

## 실전 팁

### 1. explain()으로 성능 분석

```javascript
db.orders.aggregate(
  [ ... ],
  { explain: true }
)
```

### 2. $out으로 결과 저장

```javascript
db.orders.aggregate([
  { $group: { ... } },
  {
    $out: "orderStatistics"  // 새 컬렉션에 저장
  }
])
```

### 3. $merge로 결과 병합

```javascript
db.events.aggregate([
  { $group: { ... } },
  {
    $merge: {
      into: "eventSummary",
      whenMatched: "merge",
      whenNotMatched: "insert"
    }
  }
])
```

## 결론

MongoDB Aggregation Pipeline은 복잡한 데이터 분석과 변환을 효율적으로 수행할 수 있는 강력한 도구입니다.
각 stage의 특성을 이해하고 적절히 조합하면, SQL 못지않게 강력한 쿼리를 작성할 수 있습니다! 🚀

