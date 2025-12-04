---
title: "[LeetCode] Sudoku Solver - 백트래킹으로 스도쿠 풀기"
date: "2025-12-05"
category: "Algorithm"
tags: ["LeetCode", "백트래킹", "DFS", "스도쿠", "알고리즘"]
excerpt: "LeetCode 37번 Sudoku Solver 문제를 백트래킹(DFS) 알고리즘으로 해결하는 방법을 설명합니다."
author: "Geon Lee"
---

# [LeetCode] Sudoku Solver - 백트래킹으로 스도쿠 풀기

[LeetCode 37번 Sudoku Solver](https://leetcode.com/problems/sudoku-solver/) 문제는 주어진 스도쿠 보드를 완전히 채우는 문제입니다. 이 문제는 백트래킹(Backtracking) 알고리즘의 대표적인 예제로, DFS(Depth-First Search)를 활용하여 해결할 수 있습니다.

## 문제 이해

스도쿠는 9×9 격자로 이루어진 퍼즐로, 다음 규칙을 만족해야 합니다:
- 각 행(row)에는 1-9의 숫자가 중복 없이 들어가야 합니다
- 각 열(column)에는 1-9의 숫자가 중복 없이 들어가야 합니다
- 각 3×3 박스(box)에는 1-9의 숫자가 중복 없이 들어가야 합니다

주어진 보드에서 빈 칸(‘.’)을 채워서 유효한 스도쿠를 완성해야 합니다.

## 접근 방법

백트래킹 알고리즘을 사용하여 문제를 해결합니다:
1. 빈 칸을 찾아 가능한 숫자를 시도합니다
2. 숫자를 넣고 유효성 검사를 수행합니다
3. 유효하면 다음 빈 칸으로 진행합니다
4. 유효하지 않거나 나중에 막히면 이전 상태로 되돌립니다(백트래킹)

## 코드 구현

```java
private final int n = 9, m = 10;

// 가로 체크
private boolean[][] rowCheck;

// 세로 체크
private boolean[][] colCheck;

// 박스 체크
private boolean[][] boxCheck;

// 비어있는 구역 확인
private int emptyLen;
private int[][] emptyPoint;
```

### 초기화 및 빈 칸 수집

```java
private void settingPlaceEmptyNums(int place, char[][] board) {
    int row = (place / 3) * 3, col = (place % 3) * 3;
    
    for (int y = row; y < row + 3; y++) {
        for (int x = col; x < col + 3; x++) {
            if (board[y][x] == '.') {
                emptyPoint[emptyLen][0] = y;
                emptyPoint[emptyLen][1] = x;
                emptyLen++;
                continue;
            }
            
            int num = board[y][x] - '0';
            rowCheck[y][num] = true;
            colCheck[x][num] = true;
            boxCheck[place][num] = true;
        }
    }
}
```

이 함수는 각 3×3 박스를 순회하면서:
- 빈 칸(‘.’)의 위치를 `emptyPoint` 배열에 저장합니다
- 이미 채워진 숫자는 `rowCheck`, `colCheck`, `boxCheck` 배열에 표시하여 중복 체크를 준비합니다

### 백트래킹 DFS

```java
private boolean dfs(int index, char[][] board) {
    if (this.emptyLen == index) {
        return true;  // 모든 빈 칸을 채웠으면 성공
    }
    
    int row = emptyPoint[index][0], col = emptyPoint[index][1];
    int place = (row / 3) * 3 + (col / 3);  // 현재 위치의 박스 번호
    
    for (int piece = 1; piece < 10; piece++) {
        // 유효성 검사: 행, 열, 박스에 이미 존재하는 숫자인지 확인
        if(
            rowCheck[row][piece]
            || colCheck[col][piece]
            || boxCheck[place][piece]
        ) continue;
        
        // 숫자를 넣고 체크 배열 업데이트
        rowCheck[row][piece] = true;
        colCheck[col][piece] = true;
        boxCheck[place][piece] = true;
        board[row][col] = (char) ('0' + piece);
        
        // 다음 빈 칸으로 재귀 호출
        if (dfs(index + 1, board)) return true;
        
        // 백트래킹: 실패했으면 상태 되돌리기
        rowCheck[row][piece] = false;
        colCheck[col][piece] = false;
        boxCheck[place][piece] = false;
    }
    
    return false;  // 모든 숫자를 시도했지만 실패
}
```

DFS 함수의 동작 과정:
1. **기저 조건**: 모든 빈 칸을 채웠으면 `true` 반환
2. **현재 위치 계산**: `emptyPoint[index]`에서 현재 빈 칸의 행과 열을 가져옵니다
3. **박스 번호 계산**: `(row / 3) * 3 + (col / 3)`로 현재 위치가 속한 박스 번호를 계산합니다
4. **숫자 시도**: 1부터 9까지 각 숫자를 시도합니다
5. **유효성 검사**: 행, 열, 박스에 이미 존재하는 숫자면 건너뜁니다
6. **상태 업데이트**: 숫자를 넣고 체크 배열을 업데이트합니다
7. **재귀 호출**: 다음 빈 칸으로 진행합니다
8. **백트래킹**: 실패하면 상태를 되돌리고 다음 숫자를 시도합니다

### 메인 함수

```java
public void solveSudoku(char[][] board) {
    rowCheck = new boolean[n][m];
    colCheck = new boolean[n][m];
    boxCheck = new boolean[n][m];
    emptyLen = 0;
    emptyPoint = new int[n * n][2];
    
    // 9개의 박스를 순회하며 초기화
    for (int i = 0; i < 9; i++)
        settingPlaceEmptyNums(i, board);
    
    // DFS 시작
    dfs(0, board);
}
```

## 핵심 포인트

### 1. 효율적인 중복 체크
`rowCheck`, `colCheck`, `boxCheck` 배열을 사용하여 O(1) 시간에 중복 여부를 확인할 수 있습니다. 매번 전체 행/열/박스를 검사하는 것보다 훨씬 효율적입니다.

### 2. 빈 칸 위치 사전 수집
`emptyPoint` 배열에 모든 빈 칸의 위치를 미리 저장하여, DFS 과정에서 빈 칸을 찾는 시간을 절약합니다.

### 3. 박스 번호 계산
3×3 박스의 번호를 계산하는 공식:
- 박스의 시작 행: `(row / 3) * 3`
- 박스의 시작 열: `(col / 3) * 3`
- 박스 번호: `(row / 3) * 3 + (col / 3)`

### 4. 백트래킹의 핵심
백트래킹은 "시도 → 실패 → 되돌리기"의 과정을 반복합니다. DFS에서 실패하면 상태를 원래대로 되돌려야 다음 가능성을 탐색할 수 있습니다.

## 시간 복잡도

- **시간 복잡도**: O(9^m), 여기서 m은 빈 칸의 개수입니다. 최악의 경우 각 빈 칸마다 9가지 가능성을 시도해야 합니다.
- **공간 복잡도**: O(m), 재귀 호출 스택과 빈 칸 위치 배열을 위한 공간이 필요합니다.

## 결론

Sudoku Solver 문제는 백트래킹 알고리즘의 완벽한 예제입니다. 효율적인 중복 체크와 상태 관리, 그리고 적절한 백트래킹을 통해 복잡한 제약 조건을 가진 문제를 해결할 수 있습니다. 이 패턴은 N-Queen 문제, 조합 문제 등 다른 백트래킹 문제에도 적용할 수 있습니다.

