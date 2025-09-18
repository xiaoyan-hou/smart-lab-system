# 智慧实验室系统 - 后端服务

基于 Node.js + Express + TypeScript 构建的 RESTful API 服务。

## 技术栈

- **运行时**: Node.js
- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: MySQL (后续集成)
- **身份验证**: JWT
- **文件上传**: Multer
- **密码加密**: bcryptjs

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

### 启动生产服务

```bash
npm start
```

## 项目结构

```
src/
├── controllers/        # 控制器层
├── services/          # 业务逻辑层
├── models/            # 数据模型层
├── routes/            # 路由定义
├── middleware/        # 中间件
├── utils/             # 工具函数
├── types/             # TypeScript类型定义
└── server.ts          # 服务器入口文件
```

## API 接口

### 健康检查
- **GET** `/api/health` - 服务状态检查

## 环境配置

复制 `.env.example` 为 `.env` 并配置相关参数：

```bash
cp .env.example .env
```

## 开发规范

1. 使用 TypeScript 进行类型安全的开发
2. 遵循 RESTful API 设计规范
3. 分层架构：控制器 → 服务 → 模型
4. 统一的错误处理和响应格式
5. JWT 身份验证机制