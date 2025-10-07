---
title: "Node.js Express로 REST API 구축하기"
date: "2025-10-05"
category: "Framework"
subcategory: "Node.js"
tags: ["Node.js", "Express", "REST API", "Backend"]
excerpt: "Express 프레임워크를 사용하여 RESTful API 서버를 구축하는 방법을 단계별로 알아봅니다."
author: "Geon Lee"
---

# Node.js Express로 REST API 구축하기

Express는 Node.js에서 가장 인기 있는 웹 프레임워크로, RESTful API를 쉽고 빠르게 구축할 수 있게 해줍니다.

## 프로젝트 초기 설정

```bash
# 프로젝트 초기화
mkdir my-api && cd my-api
npm init -y

# 필요한 패키지 설치
npm install express
npm install --save-dev nodemon typescript @types/express @types/node

# TypeScript 설정
npx tsc --init
```

## 기본 서버 설정

```typescript
import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 기본 라우트
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## REST API 구현

### User CRUD

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

let users: User[] = [
  { id: 1, name: 'John', email: 'john@example.com', age: 25 },
  { id: 2, name: 'Jane', email: 'jane@example.com', age: 30 },
];

// GET /api/users - 전체 조회
app.get('/api/users', (req: Request, res: Response) => {
  res.json({ data: users, count: users.length });
});

// GET /api/users/:id - 단일 조회
app.get('/api/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ data: user });
});

// POST /api/users - 생성
app.post('/api/users', (req: Request, res: Response) => {
  const { name, email, age } = req.body;
  
  // Validation
  if (!name || !email || !age) {
    return res.status(400).json({ 
      error: 'Missing required fields' 
    });
  }
  
  const newUser: User = {
    id: users.length + 1,
    name,
    email,
    age,
  };
  
  users.push(newUser);
  res.status(201).json({ data: newUser });
});

// PUT /api/users/:id - 수정
app.put('/api/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users[userIndex] = {
    ...users[userIndex],
    ...req.body,
    id, // ID는 변경 불가
  };
  
  res.json({ data: users[userIndex] });
});

// DELETE /api/users/:id - 삭제
app.delete('/api/users/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).send();
});
```

## Middleware 활용

### Logger Middleware

```typescript
const logger = (req: Request, res: Response, next: Function) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
};

app.use(logger);
```

### Error Handler Middleware

```typescript
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});
```

### Authentication Middleware

```typescript
const authMiddleware = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  // Token 검증 로직
  try {
    // verify token
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// 보호된 라우트에 적용
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is protected' });
});
```

## Router 분리

### routes/users.ts

```typescript
import { Router } from 'express';

const router = Router();

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
```

### app.ts

```typescript
import userRoutes from './routes/users';

app.use('/api/users', userRoutes);
```

## Validation

### express-validator 사용

```typescript
import { body, validationResult } from 'express-validator';

app.post('/api/users',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('age').isInt({ min: 0, max: 120 }).withMessage('Invalid age'),
    body('name').trim().notEmpty().withMessage('Name is required'),
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // 정상 처리
  }
);
```

## 데이터베이스 연동 (MongoDB)

```typescript
import mongoose from 'mongoose';

// 연결
mongoose.connect('mongodb://localhost:27017/mydb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 스키마 정의
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// CRUD 작업
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

## 환경 변수 관리

### .env

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mydb
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### config.ts

```typescript
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongodbUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
};
```

## CORS 설정

```typescript
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

## 파일 업로드

```typescript
import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  res.json({ 
    message: 'File uploaded',
    file: req.file 
  });
});
```

## 성능 최적화

### 압축

```typescript
import compression from 'compression';

app.use(compression());
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100 요청
  message: 'Too many requests',
});

app.use('/api/', limiter);
```

## 결론

Express는 간결하면서도 강력한 프레임워크로, RESTful API를 빠르게 구축할 수 있게 해줍니다.
미들웨어 시스템을 잘 활용하면 확장 가능하고 유지보수하기 쉬운 백엔드를 만들 수 있습니다! 🚀

