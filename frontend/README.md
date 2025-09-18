# 智慧实验室系统 - 前端项目

基于 React + TypeScript + Vite + Ant Design 构建的现代化前端应用。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI组件库**: Ant Design + Pro Components
- **路由**: React Router DOM
- **HTTP客户端**: Axios
- **状态管理**: React Hooks + Context

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 项目结构

```
src/
├── components/          # 通用组件
├── pages/              # 页面组件
├── hooks/              # 自定义Hooks
├── utils/              # 工具函数
├── services/           # API服务
├── types/              # TypeScript类型定义
├── assets/             # 静态资源
└── App.tsx             # 主应用组件
```

## 开发规范

1. 使用 TypeScript 进行类型安全的开发
2. 遵循 React Hooks 最佳实践
3. 组件化开发，保持组件的单一职责
4. 使用 Ant Design 组件库保持一致性
5. 代码风格遵循 ESLint + Prettier 配置