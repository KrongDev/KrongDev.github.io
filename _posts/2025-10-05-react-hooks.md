---
title: "React Hooks 완벽 가이드"
date: "2025-10-05"
category: "react"
subcategory: "frontend"
tags: ["React", "Hooks", "JavaScript", "Frontend"]
excerpt: "React Hooks의 기본부터 고급 활용법까지 모든 것을 알아봅니다. useState, useEffect, 커스텀 훅 등을 상세히 다룹니다."
author: "John Doe"
---

# React Hooks 완벽 가이드

React Hooks는 함수형 컴포넌트에서 상태 관리와 생명주기 기능을 사용할 수 있게 해주는 혁신적인 기능입니다.

## useState - 상태 관리의 시작

가장 기본적인 Hook인 `useState`를 사용하면 함수형 컴포넌트에서 상태를 관리할 수 있습니다.

```typescript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        증가
      </button>
    </div>
  );
}
```

### 핵심 포인트

- `useState`는 배열을 반환합니다 (상태값, 업데이트 함수)
- 초기값을 인자로 전달할 수 있습니다
- 여러 개의 상태를 관리할 수 있습니다

## useEffect - 사이드 이펙트 처리

`useEffect`는 컴포넌트의 생명주기에 따라 특정 작업을 수행할 수 있게 해줍니다.

```typescript
import { useEffect, useState } from 'react';

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 데이터 가져오기
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);

    // 클린업 함수
    return () => {
      console.log('컴포넌트 언마운트');
    };
  }, [userId]); // 의존성 배열

  return <div>{user?.name}</div>;
}
```

### useEffect의 의존성 배열

- **빈 배열 `[]`**: 컴포넌트 마운트 시 1회만 실행
- **없음**: 매 렌더링마다 실행
- **값 포함**: 해당 값이 변경될 때마다 실행

## 커스텀 훅 만들기

자주 사용하는 로직을 커스텀 훅으로 만들면 재사용성이 높아집니다.

```typescript
import { useState, useEffect } from 'react';

function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}

// 사용
function MyComponent() {
  const { data, loading } = useFetch<User>('/api/user');
  
  if (loading) return <div>Loading...</div>;
  return <div>{data?.name}</div>;
}
```

## 기타 유용한 Hooks

### useCallback

함수를 메모이제이션하여 불필요한 리렌더링을 방지합니다.

```typescript
const handleClick = useCallback(() => {
  console.log(value);
}, [value]);
```

### useMemo

계산 비용이 큰 값을 메모이제이션합니다.

```typescript
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

### useRef

DOM 요소에 직접 접근하거나 값을 유지합니다.

```typescript
const inputRef = useRef<HTMLInputElement>(null);

const focusInput = () => {
  inputRef.current?.focus();
};
```

## 결론

React Hooks는 함수형 컴포넌트를 더욱 강력하게 만들어줍니다. 
클래스 컴포넌트 없이도 모든 기능을 구현할 수 있으며, 코드의 재사용성과 가독성이 크게 향상됩니다.

더 많은 정보는 [공식 React 문서](https://react.dev)를 참고하세요!

