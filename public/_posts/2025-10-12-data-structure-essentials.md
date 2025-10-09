---
title: "자료구조 핵심 개념과 구현"
date: "2025-10-12"
category: "CS"
subcategory: "Structure"
tags: ["Data Structure", "Algorithm", "Computer Science", "Implementation"]
excerpt: "스택, 큐, 트리, 그래프 등 핵심 자료구조의 개념과 JavaScript로 구현하는 방법을 배웁니다."
author: "Geon Lee"
---

# 자료구조 핵심 개념과 구현

자료구조는 데이터를 효율적으로 저장하고 관리하기 위한 방법입니다.

## 배열 (Array)

연속된 메모리 공간에 데이터를 저장하는 선형 자료구조입니다.

```javascript
// 시간 복잡도
// 접근: O(1)
// 탐색: O(n)
// 삽입/삭제: O(n)

const arr = [1, 2, 3, 4, 5];

// 접근
console.log(arr[2]);  // O(1)

// 탐색
const index = arr.indexOf(3);  // O(n)

// 삽입
arr.push(6);       // O(1) - 끝에 추가
arr.unshift(0);    // O(n) - 앞에 추가
arr.splice(2, 0, 10);  // O(n) - 중간에 추가

// 삭제
arr.pop();         // O(1) - 끝에서 삭제
arr.shift();       // O(n) - 앞에서 삭제
arr.splice(2, 1);  // O(n) - 중간에서 삭제
```

## 연결 리스트 (Linked List)

노드들이 포인터로 연결된 선형 자료구조입니다.

```javascript
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }
  
  // 끝에 추가: O(1)
  append(value) {
    const node = new Node(value);
    
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    
    this.length++;
  }
  
  // 앞에 추가: O(1)
  prepend(value) {
    const node = new Node(value);
    
    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    
    this.length++;
  }
  
  // 특정 위치에 삽입: O(n)
  insertAt(index, value) {
    if (index < 0 || index > this.length) return false;
    if (index === 0) return this.prepend(value);
    if (index === this.length) return this.append(value);
    
    const node = new Node(value);
    let current = this.head;
    
    for (let i = 0; i < index - 1; i++) {
      current = current.next;
    }
    
    node.next = current.next;
    current.next = node;
    this.length++;
  }
  
  // 삭제: O(n)
  remove(value) {
    if (!this.head) return null;
    
    if (this.head.value === value) {
      this.head = this.head.next;
      this.length--;
      return value;
    }
    
    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;
        if (!current.next) this.tail = current;
        this.length--;
        return value;
      }
      current = current.next;
    }
    
    return null;
  }
  
  // 탐색: O(n)
  find(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }
  
  // 배열로 변환
  toArray() {
    const arr = [];
    let current = this.head;
    while (current) {
      arr.push(current.value);
      current = current.next;
    }
    return arr;
  }
}
```

## 스택 (Stack)

LIFO (Last In First Out) 방식의 자료구조입니다.

```javascript
class Stack {
  constructor() {
    this.items = [];
  }
  
  // 추가: O(1)
  push(element) {
    this.items.push(element);
  }
  
  // 제거: O(1)
  pop() {
    if (this.isEmpty()) return null;
    return this.items.pop();
  }
  
  // 최상단 확인: O(1)
  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
  
  size() {
    return this.items.length;
  }
  
  clear() {
    this.items = [];
  }
}

// 활용 예제: 괄호 검사
function isValidParentheses(str) {
  const stack = new Stack();
  const pairs = { '(': ')', '[': ']', '{': '}' };
  
  for (const char of str) {
    if (char in pairs) {
      stack.push(char);
    } else if (Object.values(pairs).includes(char)) {
      if (stack.isEmpty() || pairs[stack.pop()] !== char) {
        return false;
      }
    }
  }
  
  return stack.isEmpty();
}
```

## 큐 (Queue)

FIFO (First In First Out) 방식의 자료구조입니다.

```javascript
class Queue {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }
  
  // 추가: O(1)
  enqueue(element) {
    this.items[this.backIndex] = element;
    this.backIndex++;
  }
  
  // 제거: O(1)
  dequeue() {
    if (this.isEmpty()) return null;
    
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }
  
  // 앞 확인: O(1)
  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.frontIndex];
  }
  
  isEmpty() {
    return this.backIndex === this.frontIndex;
  }
  
  size() {
    return this.backIndex - this.frontIndex;
  }
}

// 우선순위 큐
class PriorityQueue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element, priority) {
    const queueElement = { element, priority };
    let added = false;
    
    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }
    
    if (!added) {
      this.items.push(queueElement);
    }
  }
  
  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift();
  }
  
  isEmpty() {
    return this.items.length === 0;
  }
}
```

## 해시 테이블 (Hash Table)

키-값 쌍으로 데이터를 저장하는 자료구조입니다.

```javascript
class HashTable {
  constructor(size = 53) {
    this.keyMap = new Array(size);
  }
  
  // 해시 함수
  _hash(key) {
    let total = 0;
    const PRIME = 31;
    
    for (let i = 0; i < Math.min(key.length, 100); i++) {
      const char = key[i];
      const value = char.charCodeAt(0) - 96;
      total = (total * PRIME + value) % this.keyMap.length;
    }
    
    return total;
  }
  
  // 삽입: O(1) 평균
  set(key, value) {
    const index = this._hash(key);
    
    if (!this.keyMap[index]) {
      this.keyMap[index] = [];
    }
    
    // 충돌 처리: Separate Chaining
    const bucket = this.keyMap[index];
    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i][0] === key) {
        bucket[i][1] = value;
        return;
      }
    }
    
    bucket.push([key, value]);
  }
  
  // 조회: O(1) 평균
  get(key) {
    const index = this._hash(key);
    const bucket = this.keyMap[index];
    
    if (bucket) {
      for (const [k, v] of bucket) {
        if (k === key) return v;
      }
    }
    
    return undefined;
  }
  
  // 삭제: O(1) 평균
  delete(key) {
    const index = this._hash(key);
    const bucket = this.keyMap[index];
    
    if (bucket) {
      for (let i = 0; i < bucket.length; i++) {
        if (bucket[i][0] === key) {
          bucket.splice(i, 1);
          return true;
        }
      }
    }
    
    return false;
  }
  
  // 모든 키
  keys() {
    const keys = [];
    for (const bucket of this.keyMap) {
      if (bucket) {
        for (const [key] of bucket) {
          keys.push(key);
        }
      }
    }
    return keys;
  }
  
  // 모든 값
  values() {
    const values = [];
    const seen = new Set();
    
    for (const bucket of this.keyMap) {
      if (bucket) {
        for (const [, value] of bucket) {
          if (!seen.has(value)) {
            values.push(value);
            seen.add(value);
          }
        }
      }
    }
    
    return values;
  }
}
```

## 이진 트리 (Binary Tree)

각 노드가 최대 2개의 자식을 가지는 트리 구조입니다.

```javascript
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  // 삽입: O(log n) 평균, O(n) 최악
  insert(value) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return this;
    }
    
    let current = this.root;
    while (true) {
      if (value === current.value) return undefined;
      
      if (value < current.value) {
        if (!current.left) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }
  
  // 탐색: O(log n) 평균
  find(value) {
    if (!this.root) return null;
    
    let current = this.root;
    while (current) {
      if (value === current.value) return current;
      current = value < current.value ? current.left : current.right;
    }
    
    return null;
  }
  
  // 중위 순회 (Inorder): 왼쪽 → 루트 → 오른쪽
  inorder(node = this.root, result = []) {
    if (node) {
      this.inorder(node.left, result);
      result.push(node.value);
      this.inorder(node.right, result);
    }
    return result;
  }
  
  // 전위 순회 (Preorder): 루트 → 왼쪽 → 오른쪽
  preorder(node = this.root, result = []) {
    if (node) {
      result.push(node.value);
      this.preorder(node.left, result);
      this.preorder(node.right, result);
    }
    return result;
  }
  
  // 후위 순회 (Postorder): 왼쪽 → 오른쪽 → 루트
  postorder(node = this.root, result = []) {
    if (node) {
      this.postorder(node.left, result);
      this.postorder(node.right, result);
      result.push(node.value);
    }
    return result;
  }
  
  // 레벨 순회 (BFS)
  levelOrder() {
    if (!this.root) return [];
    
    const result = [];
    const queue = [this.root];
    
    while (queue.length > 0) {
      const node = queue.shift();
      result.push(node.value);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    return result;
  }
}
```

## 힙 (Heap)

완전 이진 트리 기반의 자료구조입니다.

```javascript
class MaxHeap {
  constructor() {
    this.heap = [];
  }
  
  // 부모 인덱스
  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }
  
  // 자식 인덱스
  getLeftChildIndex(i) {
    return 2 * i + 1;
  }
  
  getRightChildIndex(i) {
    return 2 * i + 2;
  }
  
  // 삽입: O(log n)
  insert(value) {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }
  
  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      
      if (this.heap[parentIndex] >= this.heap[index]) break;
      
      [this.heap[parentIndex], this.heap[index]] = 
        [this.heap[index], this.heap[parentIndex]];
      
      index = parentIndex;
    }
  }
  
  // 최대값 추출: O(log n)
  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    
    return max;
  }
  
  bubbleDown(index) {
    while (true) {
      let largest = index;
      const leftIndex = this.getLeftChildIndex(index);
      const rightIndex = this.getRightChildIndex(index);
      
      if (leftIndex < this.heap.length && 
          this.heap[leftIndex] > this.heap[largest]) {
        largest = leftIndex;
      }
      
      if (rightIndex < this.heap.length && 
          this.heap[rightIndex] > this.heap[largest]) {
        largest = rightIndex;
      }
      
      if (largest === index) break;
      
      [this.heap[index], this.heap[largest]] = 
        [this.heap[largest], this.heap[index]];
      
      index = largest;
    }
  }
  
  // 최대값 확인: O(1)
  peek() {
    return this.heap[0] || null;
  }
}
```

## 그래프 (Graph)

노드와 간선으로 연결된 자료구조입니다.

```javascript
class Graph {
  constructor() {
    this.adjacencyList = {};
  }
  
  // 정점 추가: O(1)
  addVertex(vertex) {
    if (!this.adjacencyList[vertex]) {
      this.adjacencyList[vertex] = [];
    }
  }
  
  // 간선 추가: O(1)
  addEdge(v1, v2) {
    this.adjacencyList[v1].push(v2);
    this.adjacencyList[v2].push(v1);  // 무방향 그래프
  }
  
  // 간선 제거: O(E)
  removeEdge(v1, v2) {
    this.adjacencyList[v1] = this.adjacencyList[v1].filter(v => v !== v2);
    this.adjacencyList[v2] = this.adjacencyList[v2].filter(v => v !== v1);
  }
  
  // 정점 제거: O(V + E)
  removeVertex(vertex) {
    while (this.adjacencyList[vertex].length) {
      const adjacentVertex = this.adjacencyList[vertex].pop();
      this.removeEdge(vertex, adjacentVertex);
    }
    delete this.adjacencyList[vertex];
  }
  
  // DFS
  dfs(start) {
    const result = [];
    const visited = {};
    
    const traverse = (vertex) => {
      if (!vertex) return;
      
      visited[vertex] = true;
      result.push(vertex);
      
      for (const neighbor of this.adjacencyList[vertex]) {
        if (!visited[neighbor]) {
          traverse(neighbor);
        }
      }
    };
    
    traverse(start);
    return result;
  }
  
  // BFS
  bfs(start) {
    const queue = [start];
    const result = [];
    const visited = { [start]: true };
    
    while (queue.length) {
      const vertex = queue.shift();
      result.push(vertex);
      
      for (const neighbor of this.adjacencyList[vertex]) {
        if (!visited[neighbor]) {
          visited[neighbor] = true;
          queue.push(neighbor);
        }
      }
    }
    
    return result;
  }
}
```

## 결론

자료구조는 프로그래밍의 기초이자 핵심입니다.
각 자료구조의 특성을 이해하고 상황에 맞게 선택하는 것이 중요합니다.
시간 복잡도와 공간 복잡도를 고려하여 최적의 자료구조를 사용하면 효율적인 프로그램을 작성할 수 있습니다! 🚀

