# 智慧实验室系统项目结构

## 项目目录结构

```
smart-lab-system/
├── frontend/                    # 前端项目
│   ├── public/                  # 静态资源
│   ├── src/
│   │   ├── components/          # 通用组件
│   │   ├── pages/              # 页面组件
│   │   ├── services/           # API服务
│   │   ├── store/              # 状态管理
│   │   ├── utils/              # 工具函数
│   │   ├── hooks/              # 自定义Hooks
│   │   ├── types/              # TypeScript类型定义
│   │   ├── styles/             # 样式文件
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                     # 后端项目
│   ├── src/
│   │   ├── controllers/        # 控制器
│   │   ├── services/          # 业务逻辑
│   │   ├── models/            # 数据模型
│   │   ├── routes/            # 路由定义
│   │   ├── middleware/        # 中间件
│   │   ├── utils/             # 工具函数
│   │   ├── config/            # 配置文件
│   │   ├── algorithms/        # 智能算法
│   │   ├── types/             # TypeScript类型
│   │   └── app.ts
│   ├── tests/                  # 测试文件
│   ├── package.json
│   └── tsconfig.json
│
├── database/                   # 数据库相关
│   ├── migrations/            # 数据库迁移
│   ├── seeds/                 # 初始化数据
│   └── sql/                   # SQL脚本
│
├── docker/                     # Docker配置
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
├── docs/                       # 项目文档
│   ├── api/                    # API文档
│   ├── design/                 # 设计文档
│   └── deployment/             # 部署文档
│
├── scripts/                    # 脚本文件
│   ├── build.sh
│   ├── deploy.sh
│   └── backup.sh
│
└── config/                     # 配置文件
    ├── nginx.conf
    ├── redis.conf
    └── mysql.cnf
```

## 前端详细结构

```
frontend/src/
├── components/
│   ├── common/                # 通用组件
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── Footer/
│   │   ├── Loading/
│   │   └── ErrorBoundary/
│   ├── business/              # 业务组件
│   │   ├── LabCard/
│   │   ├── CourseTable/
│   │   ├── SchedulingForm/
│   │   └── EquipmentList/
│   └── charts/                # 图表组件
│       ├── LabUtilization/
│       ├── CourseDistribution/
│       └── StatisticsChart/
│
├── pages/
│   ├── login/                 # 登录页面
│   ├── dashboard/             # 仪表盘
│   ├── laboratory/            # 实验室管理
│   │   ├── list.tsx
│   │   ├── detail.tsx
│   │   └── edit.tsx
│   ├── course/                # 课程管理
│   │   ├── list.tsx
│   │   ├── detail.tsx
│   │   └── edit.tsx
│   ├── scheduling/            # 排课管理
│   │   ├── auto.tsx           # 自动排课
│   │   ├── manual.tsx         # 手动排课
│   │   ├── result.tsx         # 排课结果
│   │   └── conflict.tsx       # 冲突处理
│   ├── equipment/             # 设备管理
│   ├── statistics/            # 统计分析
│   └── system/                # 系统管理
│
├── services/
│   ├── api.ts                 # API基础配置
│   ├── auth.ts                # 认证相关API
│   ├── laboratory.ts          # 实验室API
│   ├── course.ts              # 课程API
│   ├── scheduling.ts          # 排课API
│   └── equipment.ts           # 设备API
│
├── store/
│   ├── index.ts               # Store配置
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── labSlice.ts
│   │   ├── courseSlice.ts
│   │   └── schedulingSlice.ts
│   └── actions/
│       ├── authActions.ts
│       └── labActions.ts
│
├── utils/
│   ├── request.ts             # 请求工具
│   ├── format.ts              # 格式化工具
│   ├── validate.ts            # 验证工具
│   └── constants.ts           # 常量定义
│
├── hooks/
│   ├── useAuth.ts
│   ├── useLab.ts
│   └── useScheduling.ts
│
└── types/
    ├── user.ts
    ├── lab.ts
    ├── course.ts
    └── scheduling.ts
```

## 后端详细结构

```
backend/src/
├── controllers/
│   ├── authController.ts      # 认证控制器
│   ├── userController.ts      # 用户控制器
│   ├── labController.ts       # 实验室控制器
│   ├── courseController.ts    # 课程控制器
│   ├── schedulingController.ts # 排课控制器
│   └── equipmentController.ts  # 设备控制器
│
├── services/
│   ├── authService.ts         # 认证服务
│   ├── userService.ts         # 用户服务
│   ├── labService.ts          # 实验室服务
│   ├── courseService.ts       # 课程服务
│   ├── schedulingService.ts   # 排课服务
│   │   ├── constraintService.ts    # 约束处理
│   │   ├── geneticAlgorithm.ts     # 遗传算法
│   │   └── optimizationService.ts  # 优化服务
│   └── equipmentService.ts    # 设备服务
│
├── models/
│   ├── user.model.ts          # 用户模型
│   ├── lab.model.ts           # 实验室模型
│   ├── course.model.ts        # 课程模型
│   ├── scheduling.model.ts    # 排课模型
│   └── equipment.model.ts     # 设备模型
│
├── routes/
│   ├── auth.routes.ts         # 认证路由
│   ├── user.routes.ts         # 用户路由
│   ├── lab.routes.ts          # 实验室路由
│   ├── course.routes.ts       # 课程路由
│   ├── scheduling.routes.ts   # 排课路由
│   └── equipment.routes.ts    # 设备路由
│
├── middleware/
│   ├── auth.middleware.ts     # 认证中间件
│   ├── validation.middleware.ts # 验证中间件
│   ├── error.middleware.ts    # 错误处理中间件
│   └── logger.middleware.ts   # 日志中间件
│
├── algorithms/
│   ├── genetic/               # 遗传算法
│   │   ├── chromosome.ts
│   │   ├── population.ts
│   │   ├── selection.ts
│   │   ├── crossover.ts
│   │   └── mutation.ts
│   ├── constraints/           # 约束处理
│   │   ├── timeConflict.ts
│   │   ├── capacityCheck.ts
│   │   └── equipmentCheck.ts
│   └── optimization/          # 优化算法
│       ├── simulatedAnnealing.ts
│       └── tabuSearch.ts
│
├── utils/
│   ├── database.ts            # 数据库连接
│   ├── redis.ts               # Redis连接
│   ├── logger.ts              # 日志工具
│   ├── validator.ts           # 验证工具
│   └── formatter.ts           # 格式化工具
│
└── config/
    ├── database.ts            # 数据库配置
    ├── redis.ts               # Redis配置
    ├── jwt.ts                 # JWT配置
    └── app.ts                 # 应用配置
```

## 数据库脚本结构

```
database/
├── migrations/
│   ├── 001_create_users_table.sql
│   ├── 002_create_laboratories_table.sql
│   ├── 003_create_courses_table.sql
│   ├── 004_create_schedules_table.sql
│   ├── 005_create_equipment_table.sql
│   └── 006_create_constraints_table.sql
│
├── seeds/
│   ├── 001_seed_users.sql
│   ├── 002_seed_laboratories.sql
│   ├── 003_seed_courses.sql
│   └── 004_seed_equipment.sql
│
└── sql/
    ├── init_database.sql      # 初始化数据库
    ├── backup.sql            # 备份脚本
    └── restore.sql           # 恢复脚本
```

## Docker配置结构

```
docker/
├── Dockerfile.frontend        # 前端Dockerfile
├── Dockerfile.backend         # 后端Dockerfile
├── docker-compose.yml        # Docker Compose配置（本地化轻量版，无Redis/RabbitMQ）
├── docker-compose.dev.yml    # 开发环境配置
└── docker-compose.prod.yml   # 生产环境配置
```

### Docker Compose 配置（本地化轻量版）
```yaml
# docker-compose.yml (本地化部署 - 无Redis/RabbitMQ)
version: '3.8'
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
      - ./uploads:/var/www/uploads
    depends_on:
      - frontend
      - backend

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:8080
    volumes:
      - ./frontend:/app
      - /app/node_modules

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_NAME=smart_lab
      - DB_USER=root
      - DB_PASSWORD=password
      - UPLOAD_PATH=/app/uploads
      - CACHE_PATH=/app/cache
    volumes:
      - ./uploads:/app/uploads
      - ./cache:/app/cache
      - ./logs:/app/logs
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=smart_lab
    volumes:
      - mysql_data:/var/lib/mysql
      - ./database/init:/docker-entrypoint-initdb.d
    ports:
      - "3306:3306"

volumes:
  mysql_data:
```

## 文档结构

```
docs/
├── api/                      # API文档
│   ├── auth.md
│   ├── laboratory.md
│   ├── course.md
│   ├── scheduling.md
│   └── equipment.md
│
├── design/                   # 设计文档
│   ├── database_design.md
│   ├── algorithm_design.md
│   └── ui_design.md
│
├── deployment/               # 部署文档
│   ├── development.md
│   ├── production.md
│   └── maintenance.md
│
└── user_manual/              # 用户手册
    ├── admin_manual.md
    ├── teacher_manual.md
    └── student_manual.md
```

## 配置文件说明

### 前端配置 (frontend/package.json)
```json
{
  "name": "smart-lab-frontend",
  "version": "1.0.0",
  "description": "智慧实验室系统前端",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "antd": "^5.0.0",
    "@reduxjs/toolkit": "^1.9.0",
    "react-redux": "^8.0.0",
    "axios": "^1.2.0",
    "echarts": "^5.4.0",
    "echarts-for-react": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-dom": "^18.0.0",
    "typescript": "^4.9.0",
    "vite": "^4.0.0",
    "@vitejs/plugin-react": "^3.0.0"
  }
}
```

### 后端配置 (backend/package.json)
```json
{
  "name": "smart-lab-backend",
  "version": "1.0.0",
  "description": "智慧实验室系统后端",
  "dependencies": {
    "express": "^4.18.0",
    "typescript": "^4.9.0",
    "sequelize": "^6.28.0",
    "mysql2": "^3.0.0",
    "redis": "^4.5.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "socket.io": "^4.5.0",
    "joi": "^17.7.0",
    "winston": "^3.8.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^18.11.0",
    "nodemon": "^2.0.0",
    "ts-node": "^10.9.0"
  }
}
```

## 开发环境搭建步骤

1. **克隆项目**
   ```bash
   git clone <项目地址>
   cd smart-lab-system
   ```

2. **安装依赖**
   ```bash
   # 安装前端依赖
   cd frontend
   npm install
   
   # 安装后端依赖
   cd ../backend
   npm install
   ```

3. **配置环境变量**
   ```bash
   # 后端环境配置
   cp backend/.env.example backend/.env
   # 编辑 .env 文件，配置数据库等信息
   ```

4. **初始化数据库**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

5. **启动开发服务器**
   ```bash
   # 启动后端
   npm run dev
   
   # 启动前端
   cd frontend
   npm run dev
   ```

6. **使用Docker启动**
   ```bash
   docker-compose -f docker/docker-compose.dev.yml up -d
   ```

这个结构提供了清晰的项目组织方式，便于团队协作和后期维护。每个模块都有明确的职责划分，符合软件工程的最佳实践。