---
title: "TypeScript 실전 팁 모음"
date: "2025-10-06"
category: "typescript"
subcategory: "frontend"
tags: ["TypeScript", "JavaScript", "개발팁"]
excerpt: "실무에서 바로 사용할 수 있는 TypeScript 팁들을 모았습니다. 타입 가드, 유틸리티 타입, 제네릭 활용법 등을 다룹니다."
author: "John Doe"
---

# TypeScript 실전 팁 모음 💎

실무에서 자주 사용하는 TypeScript 패턴과 팁들을 정리했습니다.

## 1. 타입 가드 (Type Guards)

런타임에서 타입을 좁혀나가는 방법입니다.

```typescript
// typeof 사용
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  return padding + value;
}

// instanceof 사용
class Dog {
  bark() { console.log("멍멍!"); }
}

class Cat {
  meow() { console.log("야옹~"); }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark();
  } else {
    animal.meow();
  }
}

// 사용자 정의 타입 가드
interface Fish {
  swim: () => void;
}

interface Bird {
  fly: () => void;
}

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

## 2. 유틸리티 타입 활용

TypeScript에서 제공하는 내장 유틸리티 타입들입니다.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

// Partial - 모든 속성을 선택적으로
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number }

// Required - 모든 속성을 필수로
type RequiredUser = Required<User>;
// { id: number; name: string; email: string; age: number }

// Pick - 특정 속성만 선택
type UserBasic = Pick<User, 'id' | 'name'>;
// { id: number; name: string }

// Omit - 특정 속성 제외
type UserWithoutEmail = Omit<User, 'email'>;
// { id: number; name: string; age?: number }

// Record - 키-값 쌍 타입 생성
type PageInfo = Record<'home' | 'about' | 'contact', { title: string }>;
// { home: { title: string }, about: { title: string }, contact: { title: string } }
```

## 3. 제네릭 활용

재사용 가능한 컴포넌트를 만들 때 필수입니다.

```typescript
// 기본 제네릭 함수
function identity<T>(arg: T): T {
  return arg;
}

// 배열 제네릭
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0];
}

// 제약 조건이 있는 제네릭
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): void {
  console.log(arg.length);
}

// 클래스에서 제네릭 사용
class DataStore<T> {
  private data: T[] = [];

  add(item: T): void {
    this.data.push(item);
  }

  get(index: number): T | undefined {
    return this.data[index];
  }

  getAll(): T[] {
    return [...this.data];
  }
}

const numberStore = new DataStore<number>();
numberStore.add(1);
numberStore.add(2);
```

## 4. 고급 타입 패턴

### Union vs Intersection

```typescript
// Union (|) - 둘 중 하나
type Status = 'idle' | 'loading' | 'success' | 'error';

// Intersection (&) - 모두 포함
type Admin = User & {
  permissions: string[];
};
```

### Discriminated Union

```typescript
type Shape = 
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; size: number }
  | { kind: 'rectangle'; width: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.size ** 2;
    case 'rectangle':
      return shape.width * shape.height;
  }
}
```

### Mapped Types

```typescript
type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

interface Product {
  id: number;
  name: string;
  price: number;
}

type ReadonlyProduct = ReadOnly<Product>;
type NullableProduct = Nullable<Product>;
```

## 5. 타입 추론 활용

```typescript
// 함수 반환 타입 추론
const createUser = () => ({
  id: 1,
  name: 'John',
  email: 'john@example.com'
});

type User = ReturnType<typeof createUser>;
// { id: number; name: string; email: string }

// 매개변수 타입 추론
function greet(name: string) {
  return `Hello, ${name}`;
}

type GreetParams = Parameters<typeof greet>;
// [name: string]
```

## 6. 실전 예제: API 응답 타입

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}

// 사용
const result = await fetchUser(1);
console.log(result.data.name); // 타입 안전!
```

## 결론

TypeScript를 잘 활용하면 코드의 안정성과 개발 생산성이 크게 향상됩니다.
타입 시스템을 제대로 이해하고 활용하는 것이 중요합니다! 🚀

