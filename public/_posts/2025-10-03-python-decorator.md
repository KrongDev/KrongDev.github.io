---
title: "Python Decorator 완전 정복"
date: "2025-10-03"
category: "Language"
subcategory: "Python"
tags: ["Python", "Decorator", "고급 문법"]
excerpt: "Python의 강력한 기능 중 하나인 Decorator를 이해하고 실전에서 활용하는 방법을 배워봅니다."
author: "Geon Lee"
---

# Python Decorator 완전 정복

Decorator는 Python의 강력한 기능으로, 함수나 클래스의 동작을 수정하거나 확장할 수 있게 해줍니다.

## Decorator란?

Decorator는 다른 함수를 감싸서 그 함수의 동작을 수정하는 함수입니다.

```python
@decorator
def my_function():
    pass

# 위 코드는 아래와 같습니다
def my_function():
    pass
my_function = decorator(my_function)
```

## 기본 Decorator

```python
def simple_decorator(func):
    def wrapper():
        print("함수 실행 전")
        func()
        print("함수 실행 후")
    return wrapper

@simple_decorator
def say_hello():
    print("Hello!")

say_hello()
# 출력:
# 함수 실행 전
# Hello!
# 함수 실행 후
```

## 인자를 받는 Decorator

```python
def decorator_with_args(func):
    def wrapper(*args, **kwargs):
        print(f"인자: {args}, {kwargs}")
        result = func(*args, **kwargs)
        print(f"반환값: {result}")
        return result
    return wrapper

@decorator_with_args
def add(a, b):
    return a + b

add(3, 5)
# 출력:
# 인자: (3, 5), {}
# 반환값: 8
```

## 실전 예제

### 1. 실행 시간 측정

```python
import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} 실행 시간: {end - start:.4f}초")
        return result
    return wrapper

@timer
def slow_function():
    time.sleep(2)
    return "완료"
```

### 2. 로깅

```python
import logging

def log(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        logging.info(f"{func.__name__} 호출됨")
        try:
            result = func(*args, **kwargs)
            logging.info(f"{func.__name__} 성공")
            return result
        except Exception as e:
            logging.error(f"{func.__name__} 실패: {e}")
            raise
    return wrapper

@log
def divide(a, b):
    return a / b
```

### 3. 캐싱

```python
def memoize(func):
    cache = {}
    
    @wraps(func)
    def wrapper(*args):
        if args in cache:
            print(f"캐시에서 반환: {args}")
            return cache[args]
        result = func(*args)
        cache[args] = result
        return result
    return wrapper

@memoize
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
```

## 매개변수를 받는 Decorator

```python
def repeat(times):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(times=3)
def greet(name):
    print(f"Hello, {name}!")

greet("World")
# 출력:
# Hello, World!
# Hello, World!
# Hello, World!
```

## 클래스 기반 Decorator

```python
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.count = 0
    
    def __call__(self, *args, **kwargs):
        self.count += 1
        print(f"호출 횟수: {self.count}")
        return self.func(*args, **kwargs)

@CountCalls
def say_hello():
    print("Hello!")
```

## 여러 Decorator 사용

```python
@decorator1
@decorator2
@decorator3
def my_function():
    pass

# 실행 순서: decorator3 -> decorator2 -> decorator1
```

## 실전 활용: API 인증

```python
from functools import wraps

def require_auth(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        token = request.headers.get('Authorization')
        if not token or not validate_token(token):
            return {"error": "Unauthorized"}, 401
        return func(request, *args, **kwargs)
    return wrapper

@require_auth
def get_user_data(request):
    return {"user": "data"}
```

## 주의사항

### 1. functools.wraps 사용

```python
from functools import wraps

def my_decorator(func):
    @wraps(func)  # 원본 함수의 메타데이터 보존
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper
```

### 2. 클로저 변수 주의

```python
def buggy_decorator():
    count = 0  # 이 변수는 변경할 수 없음
    
    def decorator(func):
        def wrapper(*args, **kwargs):
            nonlocal count  # nonlocal 키워드 필요
            count += 1
            return func(*args, **kwargs)
        return wrapper
    return decorator
```

## 결론

Decorator는 코드의 재사용성을 높이고, 횡단 관심사(로깅, 인증, 캐싱 등)를 깔끔하게 처리할 수 있게 해줍니다.
적절히 활용하면 더 우아하고 유지보수하기 쉬운 코드를 작성할 수 있습니다! 🐍

