---
title: "Java Stream API 완벽 가이드"
date: "2025-10-02"
category: "Language"
subcategory: "Java"
tags: ["Java", "Stream", "함수형 프로그래밍"]
excerpt: "Java 8에 도입된 Stream API를 활용하여 컬렉션을 효율적으로 처리하는 방법을 알아봅니다."
author: "Geon Lee"
---

# Java Stream API 완벽 가이드

Java 8부터 도입된 Stream API는 컬렉션 데이터를 함수형 스타일로 처리할 수 있게 해줍니다.

## Stream이란?

Stream은 데이터의 흐름을 나타내는 객체로, 컬렉션의 요소를 하나씩 참조하여 람다식으로 처리할 수 있는 기능입니다.

### 주요 특징

- **선언형 처리**: 무엇을 할지만 명시
- **지연 연산**: 최종 연산이 호출될 때까지 중간 연산을 실행하지 않음
- **병렬 처리**: 멀티코어를 활용한 병렬 처리 가능

## Stream 생성

```java
// 컬렉션으로부터
List<String> list = Arrays.asList("a", "b", "c");
Stream<String> stream = list.stream();

// 배열로부터
String[] array = {"a", "b", "c"};
Stream<String> stream = Arrays.stream(array);

// 직접 생성
Stream<String> stream = Stream.of("a", "b", "c");

// 무한 스트림
Stream<Integer> infiniteStream = Stream.iterate(0, n -> n + 2);
```

## 중간 연산 (Intermediate Operations)

### filter() - 조건에 맞는 요소만 선택

```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);
List<Integer> evenNumbers = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
// 결과: [2, 4, 6]
```

### map() - 요소를 변환

```java
List<String> names = Arrays.asList("apple", "banana", "cherry");
List<Integer> lengths = names.stream()
    .map(String::length)
    .collect(Collectors.toList());
// 결과: [5, 6, 6]
```

### sorted() - 정렬

```java
List<String> sorted = names.stream()
    .sorted()
    .collect(Collectors.toList());

// 역순 정렬
List<String> reverseSorted = names.stream()
    .sorted(Comparator.reverseOrder())
    .collect(Collectors.toList());
```

### distinct() - 중복 제거

```java
List<Integer> numbers = Arrays.asList(1, 2, 2, 3, 3, 4);
List<Integer> unique = numbers.stream()
    .distinct()
    .collect(Collectors.toList());
// 결과: [1, 2, 3, 4]
```

## 최종 연산 (Terminal Operations)

### collect() - 결과를 컬렉션으로 변환

```java
// List로 수집
List<String> list = stream.collect(Collectors.toList());

// Set으로 수집
Set<String> set = stream.collect(Collectors.toSet());

// Map으로 수집
Map<String, Integer> map = names.stream()
    .collect(Collectors.toMap(
        name -> name,
        String::length
    ));
```

### forEach() - 각 요소에 대해 작업 수행

```java
names.stream()
    .forEach(System.out::println);
```

### reduce() - 요소를 하나씩 줄여가며 연산

```java
// 합계
int sum = numbers.stream()
    .reduce(0, (a, b) -> a + b);

// 곱셈
int product = numbers.stream()
    .reduce(1, (a, b) -> a * b);
```

### count() - 요소 개수

```java
long count = stream.count();
```

### anyMatch(), allMatch(), noneMatch()

```java
boolean hasEven = numbers.stream()
    .anyMatch(n -> n % 2 == 0);

boolean allPositive = numbers.stream()
    .allMatch(n -> n > 0);

boolean noneNegative = numbers.stream()
    .noneMatch(n -> n < 0);
```

## 실전 예제

### 1. 사용자 필터링 및 변환

```java
class User {
    String name;
    int age;
    String city;
}

List<String> adultNamesInSeoul = users.stream()
    .filter(user -> user.getAge() >= 20)
    .filter(user -> "Seoul".equals(user.getCity()))
    .map(User::getName)
    .collect(Collectors.toList());
```

### 2. 그룹핑

```java
// 나이별로 그룹핑
Map<Integer, List<User>> byAge = users.stream()
    .collect(Collectors.groupingBy(User::getAge));

// 도시별 사용자 수
Map<String, Long> countByCity = users.stream()
    .collect(Collectors.groupingBy(
        User::getCity,
        Collectors.counting()
    ));
```

### 3. 통계

```java
IntSummaryStatistics stats = numbers.stream()
    .mapToInt(Integer::intValue)
    .summaryStatistics();

System.out.println("Count: " + stats.getCount());
System.out.println("Sum: " + stats.getSum());
System.out.println("Min: " + stats.getMin());
System.out.println("Max: " + stats.getMax());
System.out.println("Average: " + stats.getAverage());
```

## 병렬 스트림

```java
// 순차 스트림
long count = list.stream()
    .filter(s -> s.length() > 5)
    .count();

// 병렬 스트림
long count = list.parallelStream()
    .filter(s -> s.length() > 5)
    .count();
```

**주의사항**: 병렬 스트림은 항상 빠른 것은 아닙니다. 데이터 양이 적거나 연산이 간단한 경우 오히려 오버헤드가 발생할 수 있습니다.

## 성능 최적화 팁

1. **불필요한 박싱/언박싱 피하기**: `IntStream`, `LongStream`, `DoubleStream` 사용
2. **적절한 순서**: `filter`를 먼저, `map`을 나중에
3. **병렬 처리 신중하게**: 데이터 양과 연산 복잡도 고려

## 결론

Stream API는 코드를 더 간결하고 읽기 쉽게 만들어줍니다. 함수형 프로그래밍 패러다임을 이해하고 적절히 활용하면 생산성이 크게 향상됩니다! 🚀

