# 智慧实验室系统架构设计

## 1. 系统概述

智慧实验室系统是为高校实验室管理打造的综合平台，核心模块包括：
- 智能排课系统（核心）
- 实验室资源管理
- 设备管理
- 用户权限管理
- 数据统计分析
- 移动端支持

## 2. 技术架构选型

### 2.1 整体架构
采用前后端分离的微服务架构：

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端层        │    │   网关层        │    │   服务层        │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │ ┌─────────────┐ │    │ ┌─────────────┐ │
│ │  Web端(React)│ │◄──►│ │  API Gateway │ │◄──►│ │  用户服务    │ │
│ └─────────────┘ │    │ └─────────────┘ │    │ └─────────────┘ │
│                 │    │                 │    │                 │
│ ┌─────────────┐ │    │                 │    │ ┌─────────────┐ │
│ │  移动端     │ │    │                 │    │ │  排课服务    │ │
│ └─────────────┘ │    │                 │    │ └─────────────┘ │
└─────────────────┘    └─────────────────┘    │                 │
                                               │ ┌─────────────┐ │
                                               │ │  实验室服务  │ │
                                               │ └─────────────┘ │
                                               │                 │
                                               │ ┌─────────────┐ │
                                               │ │  设备服务    │ │
                                               │ └─────────────┘ │
                                               └─────────────────┘
```

### 2.2 技术栈选择

**前端技术栈：**
- React 18 + TypeScript
- Ant Design Pro (企业级中后台前端解决方案)
- Redux Toolkit (状态管理)
- React Router v6 (路由)
- Axios (HTTP请求)
- ECharts (数据可视化)

**后端技术栈：**
- Node.js + Express/Fastify
- TypeScript
- Sequelize (ORM框架)
- JWT (身份认证)
- Socket.io (实时通信)
- Redis (缓存 + 消息队列)

**数据库：**
- MySQL 8.0 (主数据库)
- Redis (缓存 + 会话存储)

**基础设施：**
- Docker + Docker Compose (容器化)
- Nginx (反向代理 + 负载均衡)
- PM2 (进程管理)

## 3. 数据库设计

### 3.1 核心数据表

```sql
-- 用户表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'teacher', 'student') NOT NULL,
    department VARCHAR(100),
    phone VARCHAR(20),
    status TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 实验室表
CREATE TABLE laboratories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    building VARCHAR(100),
    floor INT,
    room_number VARCHAR(20),
    capacity INT NOT NULL,
    equipment_count INT DEFAULT 0,
    status ENUM('available', 'maintenance', 'closed') DEFAULT 'available',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 课程表
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    credit_hours INT NOT NULL,
    teacher_id INT,
    department VARCHAR(100),
    required_labs INT DEFAULT 0,
    student_count INT DEFAULT 0,
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    status TINYINT DEFAULT 1,
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 排课表（核心表）
CREATE TABLE course_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    laboratory_id INT NOT NULL,
    teacher_id INT NOT NULL,
    week_day TINYINT NOT NULL, -- 1-7 周一到周日
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    start_week INT NOT NULL,
    end_week INT NOT NULL,
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    student_count INT NOT NULL,
    status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
    auto_scheduled TINYINT DEFAULT 1, -- 是否自动排课
    conflict_resolved TINYTEXT, -- 冲突解决记录
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (laboratory_id) REFERENCES laboratories(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_schedule_query (laboratory_id, week_day, start_time, end_time),
    INDEX idx_teacher_schedule (teacher_id, week_day, start_time, end_time)
);

-- 设备表
CREATE TABLE equipment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    model VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    laboratory_id INT,
    purchase_date DATE,
    warranty_date DATE,
    status ENUM('available', 'in_use', 'maintenance', 'broken') DEFAULT 'available',
    description TEXT,
    FOREIGN KEY (laboratory_id) REFERENCES laboratories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 排课约束规则表
CREATE TABLE scheduling_constraints (
    id INT PRIMARY KEY AUTO_INCREMENT,
    constraint_type ENUM('time_conflict', 'capacity_mismatch', 'equipment_requirement', 'teacher_preference') NOT NULL,
    laboratory_id INT,
    teacher_id INT,
    course_id INT,
    constraint_rule JSON NOT NULL, -- 约束规则详情
    priority INT DEFAULT 1, -- 优先级 1-10
    is_hard_constraint TINYINT DEFAULT 1, -- 是否硬约束
    status TINYINT DEFAULT 1,
    FOREIGN KEY (laboratory_id) REFERENCES laboratories(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 4. 智能排课算法设计

### 4.1 算法架构

```
┌─────────────────┐
│   排课请求      │
└────────┬────────┘
         │
┌────────▼────────┐
│   数据预处理      │
│  - 课程信息       │
│  - 实验室资源     │
│  - 约束条件       │
└────────┬────────┘
         │
┌────────▼────────┐
│   约束检查        │
│  - 时间冲突       │
│  - 容量匹配       │
│  - 设备需求       │
└────────┬────────┘
         │
┌────────▼────────┐
│   遗传算法        │
│  - 初始化种群     │
│  - 适应度评估     │
│  - 选择交叉变异   │
└────────┬────────┘
         │
┌────────▼────────┐
│   局部优化        │
│  - 模拟退火       │
│  - 禁忌搜索       │
└────────┬────────┘
         │
┌────────▼────────┐
│   结果输出        │
└─────────────────┘
```

### 4.2 核心算法实现

**遗传算法 + 约束满足问题（CSP）混合方案：**

1. **编码方案**：使用二维数组表示排课方案
   - 维度1：时间段（周次 × 星期 × 节次）
   - 维度2：实验室
   - 值：课程ID + 教师ID

2. **适应度函数**：
   ```javascript
   fitness = w1×conflict_penalty + w2×utilization_rate + 
             w3×preference_satisfaction + w4×balance_score
   ```

3. **约束处理**：
   - 硬约束：时间冲突、容量超限（必须满足）
   - 软约束：教师偏好、课程分布均匀性（尽量满足）

## 5. 系统模块设计

### 5.1 用户管理模块
- 用户注册/登录/权限管理
- 角色权限控制（RBAC）
- 用户信息维护

### 5.2 实验室管理模块
- 实验室基本信息管理
- 实验室状态监控
- 实验室使用统计

### 5.3 智能排课模块
- 课程信息管理
- 自动排课算法
- 手动调整功能
- 冲突检测与解决
- 排课结果导出

### 5.4 设备管理模块
- 设备台账管理
- 设备状态监控
- 维修保养记录
- 设备使用统计

### 5.5 统计分析模块
- 实验室利用率统计
- 课程分布分析
- 教师工作量统计
- 设备使用率分析

## 6. 性能优化策略

### 6.1 数据库优化
- 合理的索引设计
- 查询优化
- 读写分离
- 分库分表（数据量大时）

### 6.2 缓存策略
- Redis缓存热点数据
- 排课结果缓存
- 用户会话缓存

### 6.3 算法优化
- 并行计算
- 增量排课
- 预处理优化

## 7. 安全设计

### 7.1 认证授权
- JWT Token认证
- RBAC权限控制
- API接口鉴权

### 7.2 数据安全
- 数据加密存储
- SQL注入防护
- XSS攻击防护

### 7.3 系统安全
- HTTPS传输
- 限流防刷
- 日志审计

## 8. 部署架构

```
┌─────────────────┐
│     用户        │
└────────┬────────┘
         │
┌────────▼────────┐
│     CDN         │
└────────┬────────┘
         │
┌────────▼────────┐
│    Nginx        │
│  (负载均衡)     │
└────────┬────────┘
         │
┌────────▼────────┐
│   API Gateway   │
└────────┬────────┘
         │
┌────────▼────────┐
│   应用服务器     │
│  (Docker容器)   │
└────────┬────────┘
         │
┌────────▼────────┐
│   数据库集群     │
│  MySQL + Redis   │
└─────────────────┘
```

## 9. 开发计划

### 第一阶段（4周）
- 基础架构搭建
- 用户管理模块
- 实验室管理模块

### 第二阶段（6周）
- 智能排课核心算法
- 排课管理界面
- 基础报表功能

### 第三阶段（4周）
- 设备管理模块
- 高级统计分析
- 系统优化调试

### 第四阶段（2周）
- 测试与部署
- 文档编写
- 培训与交付

## 10. 技术选型总结

**优势：**
- 技术栈成熟稳定
- 开发效率高
- 社区支持丰富
- 易于维护和扩展

**挑战：**
- 智能排课算法复杂度较高
- 需要处理大量约束条件
- 性能优化要求较高

这个架构设计充分考虑了高校实验室管理的实际需求，通过智能算法提升排课效率，同时保证了系统的可扩展性和可维护性。