---
title: "알고리즘 기초부터 실전까지"
date: "2025-10-11"
category: "CS"
subcategory: "Algorithm"
tags: ["Algorithm", "Data Structure", "Problem Solving", "Coding Test"]
excerpt: "코딩 테스트와 실무에 필요한 핵심 알고리즘들을 이해하고 활용하는 방법을 배웁니다."
author: "Geon Lee"
---

# 알고리즘 기초부터 실전까지

알고리즘은 문제를 효율적으로 해결하기 위한 단계적 절차입니다.

## 시간 복잡도 (Time Complexity)

알고리즘의 성능을 평가하는 가장 중요한 지표입니다.

### Big-O 표기법

```
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)
```

```javascript
// O(1) - 상수 시간
function getFirst(arr) {
  return arr[0];
}

// O(n) - 선형 시간
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// O(n²) - 이차 시간
function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// O(log n) - 로그 시간
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  
  return -1;
}
```

## 정렬 알고리즘

### 퀵 정렬 (Quick Sort) - O(n log n)

```javascript
function quickSort(arr) {
  if (arr.length <= 1) return arr;
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter(x => x < pivot);
  const middle = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  
  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// 최적화된 in-place 버전
function quickSortInPlace(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSortInPlace(arr, low, pi - 1);
    quickSortInPlace(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
```

### 병합 정렬 (Merge Sort) - O(n log n)

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  return result.concat(left.slice(i), right.slice(j));
}
```

## 탐색 알고리즘

### 이진 탐색 (Binary Search)

```javascript
// 반복문 버전
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}

// 재귀 버전
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;
  
  const mid = Math.floor((left + right) / 2);
  
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  }
  return binarySearchRecursive(arr, target, left, mid - 1);
}

// 하한/상한 찾기
function lowerBound(arr, target) {
  let left = 0, right = arr.length;
  
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  
  return left;
}
```

### BFS (너비 우선 탐색)

```javascript
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  
  visited.add(start);
  
  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}

// 최단 거리 찾기
function shortestPath(graph, start, end) {
  const queue = [[start, [start]]];
  const visited = new Set([start]);
  
  while (queue.length > 0) {
    const [node, path] = queue.shift();
    
    if (node === end) {
      return path;
    }
    
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }
  
  return null;
}
```

### DFS (깊이 우선 탐색)

```javascript
// 재귀 버전
function dfs(graph, node, visited = new Set(), result = []) {
  visited.add(node);
  result.push(node);
  
  for (const neighbor of graph[node]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited, result);
    }
  }
  
  return result;
}

// 반복문 버전 (스택 사용)
function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  const result = [];
  
  while (stack.length > 0) {
    const node = stack.pop();
    
    if (!visited.has(node)) {
      visited.add(node);
      result.push(node);
      
      // 역순으로 추가 (먼저 탐색할 노드를 나중에 push)
      for (let i = graph[node].length - 1; i >= 0; i--) {
        stack.push(graph[node][i]);
      }
    }
  }
  
  return result;
}
```

## 동적 프로그래밍 (Dynamic Programming)

### 피보나치 수열

```javascript
// ❌ 나쁜 예: O(2ⁿ)
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// ✅ 메모이제이션: O(n)
function fibonacciMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  
  memo[n] = fibonacciMemo(n - 1, memo) + fibonacciMemo(n - 2, memo);
  return memo[n];
}

// ✅ 타뷸레이션 (Bottom-up): O(n)
function fibonacciTab(n) {
  if (n <= 1) return n;
  
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// ✅ 공간 최적화: O(1)
function fibonacciOptimized(n) {
  if (n <= 1) return n;
  
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  
  return curr;
}
```

### 배낭 문제 (Knapsack Problem)

```javascript
function knapsack(items, capacity) {
  const n = items.length;
  const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    const { weight, value } = items[i - 1];
    
    for (let w = 0; w <= capacity; w++) {
      if (weight <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],              // 현재 아이템 제외
          dp[i - 1][w - weight] + value  // 현재 아이템 포함
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  return dp[n][capacity];
}

// 선택된 아이템 추적
function knapsackWithItems(items, capacity) {
  const n = items.length;
  const dp = Array(n + 1).fill(0).map(() => Array(capacity + 1).fill(0));
  
  // DP 테이블 채우기
  for (let i = 1; i <= n; i++) {
    const { weight, value } = items[i - 1];
    for (let w = 0; w <= capacity; w++) {
      if (weight <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weight] + value
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }
  
  // 선택된 아이템 찾기
  const selected = [];
  let w = capacity;
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      selected.push(items[i - 1]);
      w -= items[i - 1].weight;
    }
  }
  
  return { maxValue: dp[n][capacity], items: selected };
}
```

## 그리디 알고리즘

### 동전 교환 문제

```javascript
function coinChange(coins, amount) {
  coins.sort((a, b) => b - a);  // 큰 동전부터
  
  let count = 0;
  for (const coin of coins) {
    if (amount >= coin) {
      const use = Math.floor(amount / coin);
      count += use;
      amount -= coin * use;
    }
  }
  
  return amount === 0 ? count : -1;
}
```

### 활동 선택 문제

```javascript
function activitySelection(activities) {
  // 종료 시간 기준 정렬
  activities.sort((a, b) => a.end - b.end);
  
  const selected = [activities[0]];
  let lastEnd = activities[0].end;
  
  for (let i = 1; i < activities.length; i++) {
    if (activities[i].start >= lastEnd) {
      selected.push(activities[i]);
      lastEnd = activities[i].end;
    }
  }
  
  return selected;
}
```

## 실전 문제 패턴

### 투 포인터 (Two Pointers)

```javascript
// 정렬된 배열에서 합이 target인 두 수 찾기
function twoSum(arr, target) {
  let left = 0, right = arr.length - 1;
  
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;
    } else {
      right--;
    }
  }
  
  return null;
}
```

### 슬라이딩 윈도우 (Sliding Window)

```javascript
// 크기 k인 부분 배열의 최대 합
function maxSubarraySum(arr, k) {
  let maxSum = 0;
  let windowSum = 0;
  
  // 첫 윈도우
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;
  
  // 슬라이딩
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }
  
  return maxSum;
}
```

### 백트래킹 (Backtracking)

```javascript
// N-Queens 문제
function solveNQueens(n) {
  const result = [];
  const board = Array(n).fill(0).map(() => Array(n).fill('.'));
  
  function isSafe(row, col) {
    // 같은 열 확인
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 'Q') return false;
    }
    
    // 대각선 확인
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 'Q') return false;
    }
    for (let i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
      if (board[i][j] === 'Q') return false;
    }
    
    return true;
  }
  
  function backtrack(row) {
    if (row === n) {
      result.push(board.map(r => r.join('')));
      return;
    }
    
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = 'Q';
        backtrack(row + 1);
        board[row][col] = '.';  // 백트래킹
      }
    }
  }
  
  backtrack(0);
  return result;
}
```

## 결론

알고리즘은 문제 해결 능력의 핵심입니다.
기본 알고리즘을 이해하고 다양한 문제에 적용하는 연습이 중요합니다.
코딩 테스트뿐만 아니라 실무에서도 효율적인 코드를 작성하는 데 필수적입니다! 🚀

