# 智慧实验室系统整体架构方案

## 1. 架构设计总览

### 1.1 架构设计原则
```
✅ 高可用性：99.9%系统可用性保障
✅ 高并发：支持1000+并发用户
✅ 可扩展：微服务架构，支持水平扩展
✅ 安全性：多层次安全防护
✅ 可维护：模块化设计，便于维护升级
✅ 成本效益：开源技术栈，降低总体成本
```

### 1.2 整体架构图（本地化轻量级版）
```
┌─────────────────────────────────────────────────────────────────┐
│                        用户接入层                                │
├─────────────────┬─────────────────┬─────────────────┬─────────────┤
│   Web端(React)  │   移动端(H5)    │  管理后台       │  API接口   │
└────────┬────────┴────────┬────────┴────────┬────────┴──────┬──────┘
         │                 │                │              │
         ▼                 ▼                ▼              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         网关层                                   │
├─────────────┬──────────────┬─────────────┬──────────────────────┤
│  Nginx      │  简单路由    │  基础负载   │   本地文件存储       │
│  (反向代理)  │  (Express)   │  (轮询)     │   (本地磁盘)         │
└─────┬───────┴──────┬────────┴──────┬──────┴──────────┬─────────┘
      │              │               │                │
      ▼              ▼               ▼                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        服务层                                  │
├────────────┬────────────┬────────────┬────────────┬──────────────┤
│  用户服务   │  排课服务   │  实验室服务 │  设备服务   │  通知服务     │
│  (Auth)    │  (Schedule)│  (Lab)     │  (Equipment)│ (Notification)│
└────┬───────┴────┬───────┴────┬───────┴────┬──────┴──────┬──────┘
     │            │            │            │             │
     ▼            ▼            ▼            ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      数据访问层（简化版）                     │
├────────────────────┬────────────────────┬──────────────────────┤
│    MySQL主数据库    │   本地文件缓存     │   简单消息机制       │
│   (单一实例)        │  (JSON文件)        │  (数据库队列表)      │
└────────────────────┴────────────────────┴──────────────────────┘
```

## 2. 技术架构选型

### 2.1 前端技术架构
```typescript
// 技术栈选择理由分析
前端技术栈 = {
    框架: "React 18",
    理由: [
        "组件化开发，提高代码复用率",
        "虚拟DOM，性能优秀",
        "生态系统完善，社区活跃",
        "TypeScript支持好，类型安全"
    ],
    
    UI库: "Ant Design Pro",
    理由: [
        "企业级UI设计系统",
        "丰富的业务组件",
        "支持主题定制",
        "国际化支持"
    ],
    
    状态管理: "Redux Toolkit",
    理由: [
        "官方推荐，维护活跃",
        "减少样板代码",
        "DevTools支持好",
        "异步处理能力强"
    ],
    
    构建工具: "Vite",
    理由: [
        "构建速度快",
        "开发体验好",
        "插件生态丰富",
        "生产优化好"
    ]
}
```

### 2.2 后端技术架构
```typescript
// 后端技术栈选择
后端技术栈 = {
    运行时: "Node.js 18 LTS",
    理由: [
        "JavaScript全栈开发，技能复用",
        "异步I/O，高并发处理能力强",
        "生态丰富，npm包管理方便",
        "团队技术栈匹配"
    ],
    
    Web框架: "Express.js + TypeScript",
    理由: [
        "成熟稳定，文档完善",
        "中间件生态丰富",
        "TypeScript支持好",
        "学习成本低"
    ],
    
    数据库ORM: "Sequelize",
    理由: [
        "支持多种数据库",
        "模型定义清晰",
        "迁移工具完善",
        "查询构建器强大"
    ],
    
   // 实时通信: "Socket.io + 内存存储",
    理由: [
        "WebSocket封装完善",
        "自动降级支持", 
        "房间管理方便",
        "广播功能强大",
        "无需Redis，内存存储适配"
    ]
}
```

### 2.3 数据库架构选型（本地化简化版）
```sql
-- 数据库选型分析（本地化部署）
主数据库: MySQL 8.0
选择理由:
- 成熟稳定，高校环境广泛使用
- ACID特性保证，数据一致性
- 支持复杂查询和事务
- 性能优化工具丰富
- 团队技术栈匹配
- 开源免费，无授权成本

本地缓存方案: 文件缓存 + 内存缓存
替代Redis方案:
- JSON文件缓存: 配置文件和静态数据
- 内存缓存: Node.js内存对象缓存
- 数据库缓存: MySQL查询缓存
- 浏览器缓存: 前端localStorage

-- 本地化数据库架构设计原则
设计原则:
1. 单实例部署: 一台服务器运行所有服务
2. 数据隔离: 按业务模块分表，不分库
3. 索引优化: 合理设计索引，提升查询性能
4. 数据备份: 定期全量备份，binlog增量备份
5. 性能调优: MySQL配置优化，查询优化

-- 轻量级消息机制
消息通信: 数据库队列表 + 定时任务
替代RabbitMQ方案:
- 队列表: MySQL表实现消息队列
- 定时任务: Node.js定时轮询处理
- 事件通知: WebSocket实时推送
- 异步处理: 后台进程处理耗时任务
```

## 3. 系统分层架构设计

### 3.1 分层架构原则
```
表现层 (Presentation Layer)
    ↓
业务层 (Business Logic Layer)
    ↓
领域层 (Domain Layer)
    ↓
数据访问层 (Data Access Layer)
    ↓
基础设施层 (Infrastructure Layer)
```

### 3.2 前端分层架构
```typescript
// 前端分层架构实现
前端架构分层 = {
    表现层: {
        组件: "React Components",
        职责: [
            "UI渲染和交互",
            "数据展示",
            "用户输入处理"
        ]
    },
    
    业务逻辑层: {
        组件: "Hooks + Services",
        职责: [
            "业务逻辑处理",
            "API数据交互",
            "状态管理"
        ]
    },
    
    数据访问层: {
        组件: "API Service",
        职责: [
            "HTTP请求封装",
            "数据格式转换",
            "错误处理"
        ]
    },
    
    工具层: {
        组件: "Utils + Constants",
        职责: [
            "通用工具函数",
            "常量定义",
            "数据格式化"
        ]
    }
}
```

### 3.3 后端分层架构
```typescript
// 后端分层架构实现
后端架构分层 = {
    接口层: {
        组件: "Controllers",
        职责: [
            "请求参数验证",
            "响应格式封装",
            "错误统一处理"
        ]
    },
    
    业务逻辑层: {
        组件: "Services",
        职责: [
            "核心业务逻辑",
            "事务管理",
            "业务规则验证"
        ]
    },
    
    领域模型层: {
        组件: "Models + Entities",
        职责: [
            "数据模型定义",
            "业务实体封装",
            "领域逻辑实现"
        ]
    },
    
    数据访问层: {
        组件: "Repositories + DAO",
        职责: [
            "数据库操作",
            "缓存管理",
            "数据持久化"
        ]
    }
}
```

## 4. 核心模块架构设计

### 4.1 智能排课系统架构（本地化适配版）
```typescript
// 智能排课系统架构设计（无Redis版本）
智能排课架构 = {
    算法引擎层: {
        遗传算法引擎: {
            编码方案: "二维数组编码(课程-实验室-时间)",
            适应度函数: "多目标加权评分",
            选择策略: "锦标赛选择 + 精英保留",
            交叉变异: "单点交叉 + 随机变异",
            内存优化: "算法中间结果内存存储"
        },
        
        约束处理引擎: {
            硬约束: "时间冲突、容量超限、设备缺失",
            软约束: "教师偏好、分布均匀、时段偏好",
            惩罚函数: "分级惩罚机制",
            数据库约束: "MySQL存储约束规则"
        },
        
        优化策略引擎: {
            局部搜索: "模拟退火算法",
            禁忌搜索: "避免局部最优",
            混合优化: "遗传算法 + 局部搜索",
            文件缓存: "算法参数本地文件缓存"
        }
    },
    
    业务逻辑层: {
        排课服务: {
            自动排课: "一键智能排课",
            手动调整: "拖拽式手动调整",
            冲突检测: "实时冲突识别",
            结果优化: "排课结果微调",
            进度存储: "MySQL存储排课进度"
        },
        
        约束管理: {
            约束配置: "灵活约束规则配置",
            约束验证: "实时约束检查",
            冲突解决: "智能冲突解决建议",
            文件备份: "约束配置JSON文件备份"
        }
    },
    
    数据管理层: {
        课程数据管理: "课程信息、人数、要求",
        资源数据管理: "实验室、设备、容量",
        约束数据管理: "时间约束、偏好约束",
        结果数据管理: "排课结果、历史记录",
        本地缓存: "常用数据JSON文件缓存"
    }
}
```

### 4.2 排课算法详细设计
```typescript
// 遗传算法实现细节
class GeneticSchedulingAlgorithm {
    // 染色体编码设计
    chromosomeEncoding = {
        structure: "genes[courseIndex][labIndex][timeSlot][weekDay][week]",
        geneLength: 5,
        encodingType: "permutation encoding",
        validityCheck: "constraint satisfaction"
    };
    
    // 适应度函数设计
    fitnessFunction = {
        hardConstraints: {
            timeConflict: "penalty: -1000",
            capacityOverflow: "penalty: -1000",
            equipmentMissing: "penalty: -800"
        },
        
        softConstraints: {
            teacherPreference: "penalty: -100",
            timeDistribution: "reward: +50",
            labUtilization: "reward: +30"
        },
        
        optimizationObjectives: {
            resourceUtilization: "weight: 0.4",
            satisfactionRate: "weight: 0.3",
            distributionBalance: "weight: 0.3"
        }
    };
    
    // 算法参数配置
    algorithmParameters = {
        populationSize: 100,
        maxGenerations: 500,
        crossoverRate: 0.8,
        mutationRate: 0.1,
        elitismRate: 0.1,
        convergenceCriteria: "fitness improvement < 0.001"
    };
}
```

### 4.3 实验室管理模块架构
```typescript
// 实验室管理模块架构
实验室管理架构 = {
    资源管理层: {
        实验室信息管理: {
            基本信息: "名称、编号、位置、容量",
            设备配置: "设备清单、规格参数",
            状态管理: "可用、维护、关闭状态",
            图片管理: "实验室照片、布局图"
        }
    },
    
    预约管理层: {
        预约申请: {
            申请流程: "提交->审核->确认",
            时间冲突: "自动冲突检测",
            优先级: "教学优先、公平分配"
        },
        
        使用管理: {
            使用登记: "实际使用记录",
            使用统计: "利用率、使用时长",
            费用计算: "使用费用统计"
        }
    },
    
    监控分析层: {
        实时监控: {
            使用状态: "当前使用状态",
            设备状态: "设备运行状态",
            环境监控: "温度、湿度等"
        },
        
        统计分析: {
            利用率分析: "时间维度分析",
            趋势分析: "使用趋势预测",
            效率评估: "资源利用效率"
        }
    }
}
```

## 5. 数据库架构设计

### 5.1 数据库设计原则
```sql
-- 数据库设计原则
设计原则: {
    规范化: "第三范式，减少数据冗余",
    性能优化: "合理反范式，提升查询性能",
    扩展性: "预留扩展字段，支持业务变化",
    安全性: "敏感数据加密，访问权限控制",
    可追溯: "操作日志记录，数据变更追踪"
}

-- 分库分表策略
分库策略: {
    用户库: "users_db - 用户相关数据",
    业务库: "business_db - 课程、排课数据",
    资源库: "resource_db - 实验室、设备数据",
    日志库: "log_db - 操作日志、历史数据"
}

-- 索引设计原则
索引原则: {
    主键索引: "所有表必须有主键",
    外键索引: "外键字段建立索引",
    查询索引: "高频查询字段组合索引",
    排序索引: "排序字段建立索引",
    覆盖索引: "查询字段包含在索引中"
}
```

-- 本地化消息队列表（替代RabbitMQ）
CREATE TABLE message_queue (
    id INT PRIMARY KEY AUTO_INCREMENT,
    queue_name VARCHAR(50) NOT NULL COMMENT '队列名称',
    message_type VARCHAR(50) NOT NULL COMMENT '消息类型',
    message_content TEXT NOT NULL COMMENT '消息内容',
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending' COMMENT '状态',
    retry_count INT DEFAULT 0 COMMENT '重试次数',
    max_retry INT DEFAULT 3 COMMENT '最大重试次数',
    scheduled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '计划执行时间',
    processed_at TIMESTAMP NULL COMMENT '处理时间',
    error_message TEXT COMMENT '错误信息',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_queue_status (queue_name, status),
    INDEX idx_scheduled_time (scheduled_at),
    INDEX idx_message_type (message_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息队列表';

-- 系统配置缓存表（替代Redis配置缓存）
CREATE TABLE system_config (
    config_key VARCHAR(100) PRIMARY KEY COMMENT '配置键',
    config_value TEXT COMMENT '配置值',
    config_type VARCHAR(20) DEFAULT 'string' COMMENT '配置类型',
    description TEXT COMMENT '配置描述',
    is_cached TINYINT DEFAULT 1 COMMENT '是否缓存到文件',
    cache_file VARCHAR(255) COMMENT '缓存文件路径',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_config_type (config_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';

-- 文件元数据表（替代MinIO元数据）
CREATE TABLE file_metadata (
    id INT PRIMARY KEY AUTO_INCREMENT,
    file_name VARCHAR(255) NOT NULL COMMENT '文件名',
    file_path VARCHAR(500) NOT NULL COMMENT '文件路径',
    file_size BIGINT NOT NULL COMMENT '文件大小',
    file_type VARCHAR(100) COMMENT '文件类型',
    mime_type VARCHAR(100) COMMENT 'MIME类型',
    md5_hash VARCHAR(32) COMMENT 'MD5哈希值',
    upload_user_id INT COMMENT '上传用户ID',
    related_type VARCHAR(50) COMMENT '关联类型',
    related_id INT COMMENT '关联ID',
    storage_type ENUM('local', 'network') DEFAULT 'local' COMMENT '存储类型',
    access_count INT DEFAULT 0 COMMENT '访问次数',
    status TINYINT DEFAULT 1 COMMENT '状态(1正常,0删除)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (upload_user_id) REFERENCES users(id),
    INDEX idx_file_path (file_path),
    INDEX idx_related (related_type, related_id),
    INDEX idx_upload_user (upload_user_id),
    INDEX idx_md5_hash (md5_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文件元数据表';

-- 用户管理表
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    role ENUM('admin', 'teacher', 'student') NOT NULL COMMENT '角色',
    department VARCHAR(100) COMMENT '院系',
    phone VARCHAR(20) COMMENT '电话',
    avatar_url VARCHAR(255) COMMENT '头像URL',
    status TINYINT DEFAULT 1 COMMENT '状态(1启用,0禁用)',
    last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 实验室表
CREATE TABLE laboratories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lab_code VARCHAR(20) UNIQUE NOT NULL COMMENT '实验室编号',
    lab_name VARCHAR(100) NOT NULL COMMENT '实验室名称',
    building VARCHAR(100) NOT NULL COMMENT '所在建筑',
    floor INT NOT NULL COMMENT '楼层',
    room_number VARCHAR(20) NOT NULL COMMENT '房间号',
    capacity INT NOT NULL COMMENT '容纳人数',
    area DECIMAL(8,2) COMMENT '面积(m²)',
    equipment_count INT DEFAULT 0 COMMENT '设备数量',
    computer_count INT DEFAULT 0 COMMENT '计算机数量',
    status ENUM('available', 'maintenance', 'closed') DEFAULT 'available' COMMENT '状态',
    manager_id INT COMMENT '负责人ID',
    open_time TIME COMMENT '开放时间',
    close_time TIME COMMENT '关闭时间',
    description TEXT COMMENT '描述信息',
    images JSON COMMENT '图片URLs',
    features JSON COMMENT '功能特性',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(id),
    INDEX idx_lab_code (lab_code),
    INDEX idx_status_capacity (status, capacity),
    INDEX idx_building_floor (building, floor),
    FULLTEXT idx_name_description (lab_name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='实验室表';

-- 课程表
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(20) UNIQUE NOT NULL COMMENT '课程代码',
    course_name VARCHAR(200) NOT NULL COMMENT '课程名称',
    course_type ENUM('required', 'elective', 'practical') NOT NULL COMMENT '课程类型',
    credit_hours INT NOT NULL COMMENT '学分',
    total_hours INT NOT NULL COMMENT '总学时',
    practical_hours INT DEFAULT 0 COMMENT '实验学时',
    teacher_id INT NOT NULL COMMENT '授课教师ID',
    department VARCHAR(100) NOT NULL COMMENT '开课院系',
    student_count INT DEFAULT 0 COMMENT '学生人数',
    max_students INT COMMENT '最大容量',
    semester VARCHAR(20) NOT NULL COMMENT '学期',
    academic_year VARCHAR(20) NOT NULL COMMENT '学年',
    required_labs INT DEFAULT 0 COMMENT '所需实验室数量',
    required_equipment JSON COMMENT '所需设备清单',
    prerequisites TEXT COMMENT '先修要求',
    objectives TEXT COMMENT '课程目标',
    description TEXT COMMENT '课程描述',
    status TINYINT DEFAULT 1 COMMENT '状态(1启用,0禁用)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    INDEX idx_course_code (course_code),
    INDEX idx_teacher_semester (teacher_id, semester),
    INDEX idx_department_status (department, status),
    FULLTEXT idx_course_name (course_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程表';

-- 排课表(核心表)
CREATE TABLE course_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL COMMENT '课程ID',
    laboratory_id INT NOT NULL COMMENT '实验室ID',
    teacher_id INT NOT NULL COMMENT '教师ID',
    week_day TINYINT NOT NULL COMMENT '星期(1-7)',
    start_time TIME NOT NULL COMMENT '开始时间',
    end_time TIME NOT NULL COMMENT '结束时间',
    start_week INT NOT NULL COMMENT '开始周次',
    end_week INT NOT NULL COMMENT '结束周次',
    semester VARCHAR(20) NOT NULL COMMENT '学期',
    academic_year VARCHAR(20) NOT NULL COMMENT '学年',
    student_count INT NOT NULL COMMENT '学生人数',
    actual_students INT COMMENT '实际到课人数',
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled' COMMENT '状态',
    auto_scheduled TINYINT DEFAULT 1 COMMENT '是否自动排课',
    conflict_resolved TINYTEXT COMMENT '冲突解决记录',
    notes TEXT COMMENT '备注信息',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (laboratory_id) REFERENCES laboratories(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id),
    INDEX idx_schedule_query (laboratory_id, week_day, start_time, semester),
    INDEX idx_teacher_schedule (teacher_id, week_day, start_time, end_time),
    INDEX idx_course_semester (course_id, semester),
    INDEX idx_status_time (status, start_time),
    UNIQUE KEY uk_schedule_time (laboratory_id, week_day, start_time, end_time, start_week, end_week, semester)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='排课表';

-- 设备表
CREATE TABLE equipment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    equipment_code VARCHAR(50) UNIQUE NOT NULL COMMENT '设备编号',
    equipment_name VARCHAR(100) NOT NULL COMMENT '设备名称',
    equipment_model VARCHAR(100) COMMENT '设备型号',
    equipment_type VARCHAR(50) NOT NULL COMMENT '设备类型',
    manufacturer VARCHAR(100) COMMENT '生产厂家',
    serial_number VARCHAR(100) UNIQUE COMMENT '序列号',
    laboratory_id INT COMMENT '所属实验室ID',
    purchase_date DATE COMMENT '购买日期',
    purchase_price DECIMAL(10,2) COMMENT '购买价格',
    warranty_date DATE COMMENT '保修到期日期',
    status ENUM('available', 'in_use', 'maintenance', 'broken', 'retired') DEFAULT 'available' COMMENT '状态',
    specifications JSON COMMENT '技术规格',
    location VARCHAR(200) COMMENT '存放位置',
    responsible_user_id INT COMMENT '责任人ID',
    maintenance_cycle INT COMMENT '维护周期(天)',
    last_maintenance_date DATE COMMENT '上次维护日期',
    next_maintenance_date DATE COMMENT '下次维护日期',
    description TEXT COMMENT '设备描述',
    images JSON COMMENT '设备图片',
    attachments JSON COMMENT '相关附件',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (laboratory_id) REFERENCES laboratories(id),
    FOREIGN KEY (responsible_user_id) REFERENCES users(id),
    INDEX idx_equipment_code (equipment_code),
    INDEX idx_laboratory_status (laboratory_id, status),
    INDEX idx_type_status (equipment_type, status),
    INDEX idx_maintenance_date (next_maintenance_date),
    FULLTEXT idx_equipment_name (equipment_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备表';
```

## 6. 接口设计原则

### 6.1 RESTful API设计规范
```typescript
// API设计规范
API设计规范 = {
    命名规范: {
        资源命名: "复数名词，小写字母，连字符连接",
        示例: "/api/v1/laboratories", "/api/v1/course-schedules"
    },
    
    HTTP方法: {
        GET: "查询资源",
        POST: "创建资源", 
        PUT: "全量更新",
        PATCH: "部分更新",
        DELETE: "删除资源"
    },
    
    状态码: {
        200: "请求成功",
        201: "资源创建成功",
        400: "请求参数错误",
        401: "未授权",
        403: "权限不足",
        404: "资源不存在",
        500: "服务器内部错误"
    },
    
    响应格式: {
        success: {
            code: 200,
            message: "success",
            data: {},
            timestamp: "2024-01-01T00:00:00Z"
        },
        error: {
            code: 400,
            message: "error message",
            error: "error details",
            timestamp: "2024-01-01T00:00:00Z"
        }
    }
};
```

### 6.2 核心接口设计
```typescript
// 智能排课相关接口
interface SchedulingAPI {
    // 自动排课
    POST /api/v1/scheduling/auto
    Request: {
        semester: string;
        academicYear: string;
        courseIds?: number[];
        constraints?: Constraint[];
        algorithmParams?: AlgorithmParams;
    }
    Response: {
        scheduleId: string;
        status: "processing" | "completed" | "failed";
        progress: number;
        result?: ScheduleResult;
    }
    
    // 获取排课进度
    GET /api/v1/scheduling/{scheduleId}/progress
    Response: {
        scheduleId: string;
        progress: number;
        message: string;
        conflicts: Conflict[];
        suggestions: Suggestion[];
    }
    
    // 手动调整排课
    PUT /api/v1/scheduling/{scheduleId}/adjust
    Request: {
        courseId: number;
        laboratoryId: number;
        timeSlot: TimeSlot;
        reason?: string;
    }
    Response: {
        success: boolean;
        conflicts?: Conflict[];
        alternativeSuggestions?: Suggestion[];
    }
}

// 实验室管理接口
interface LaboratoryAPI {
    // 获取实验室列表
    GET /api/v1/laboratories
    Query: {
        page?: number;
        pageSize?: number;
        building?: string;
        status?: string;
        capacityMin?: number;
        capacityMax?: number;
    }
    Response: {
        data: Laboratory[];
        total: number;
        page: number;
        pageSize: number;
    }
    
    // 获取实验室预约情况
    GET /api/v1/laboratories/{id}/schedule
    Query: {
        semester: string;
        week?: number;
        startDate?: string;
        endDate?: string;
    }
    Response: {
        laboratoryId: number;
        occupancy: TimeSlotOccupancy[];
        statistics: OccupancyStatistics;
    }
}
```

## 7. 安全架构设计

### 7.1 安全架构分层
```
安全架构分层 = {
    网络安全层: {
        DDoS防护: "CloudFlare/阿里云盾",
        WAF防护: "Web应用防火墙",
        SSL/TLS: "HTTPS加密传输",
        网络隔离: "VPC私有网络"
    },
    
    应用安全层: {
        身份认证: "JWT Token认证",
        权限控制: "RBAC角色权限",
        输入验证: "参数校验 + SQL注入防护",
        XSS防护: "输出编码 + CSP策略"
    },
    
    数据安全层: {
        数据加密: "敏感数据AES加密",
        数据脱敏: "个人信息脱敏显示",
        访问控制: "数据库访问权限控制",
        备份加密: "备份数据加密存储"
    },
    
    系统安全层: {
        操作系统: "定期安全更新",
        容器安全: "镜像安全扫描",
        日志审计: "操作日志完整记录",
        监控告警: "异常行为实时告警"
    }
}
```

### 7.2 认证授权架构
```typescript
// JWT认证架构设计
认证架构 = {
    Token结构: {
        header: {
            alg: "HS256",
            typ: "JWT"
        },
        payload: {
            userId: "用户ID",
            username: "用户名", 
            role: "用户角色",
            permissions: ["权限列表"],
            iat: "签发时间",
            exp: "过期时间",
            jti: "Token唯一标识"
        }
    },
    
    认证流程: {
        登录: "验证用户名密码 → 生成Token → 返回客户端",
        访问: "携带Token → 验证签名 → 检查权限 → 允许访问",
        刷新: "Token快过期 → 刷新Token → 延长有效期"
    },
    
    权限控制: {
        角色定义: "admin | teacher | student",
        权限粒度: "基于资源的权限控制(RBAC)",
        动态权限: "支持运行时权限变更"
    }
};
```

### 7.3 数据安全防护
```typescript
// 数据安全防护策略
数据安全防护 = {
    传输安全: {
        HTTPS强制: "所有接口强制HTTPS",
        HSTS策略: "HTTP严格传输安全",
        证书管理: "SSL证书自动更新"
    },
    
    存储安全: {
        密码安全: "bcrypt加密 + salt",
        敏感数据: "AES-256加密存储",
        密钥管理: "密钥分离存储"
    },
    
    访问安全: {
        SQL注入: "参数化查询 + ORM",
        越权访问: "权限验证 + 数据隔离",
        敏感操作: "二次确认 + 审计日志"
    }
};
```

## 8. 扩展性设计

### 8.1 水平扩展架构
```
水平扩展架构 = {
    应用层扩展: {
        负载均衡: "Nginx + 一致性哈希",
        无状态设计: "会话数据外部存储",
        服务发现: "Consul + 健康检查",
        自动伸缩: "基于CPU/内存指标"
    },
    
    数据层扩展: {
        读写分离: "主从复制 + 读写分离",
        分库分表: "按业务模块 + 时间维度",
        缓存集群: "Redis Cluster + 哨兵模式",
        CDN加速: "静态资源CDN分发"
    },
    
    微服务扩展: {
        服务拆分: "按业务领域拆分服务",
        独立部署: "每个服务独立部署",
        技术异构: "不同服务选择最适合技术",
        容错处理: "熔断降级 + 限流控制"
    }
}
```

### 8.2 本地化部署架构策略
```typescript
// 本地化部署架构方案（单服务器）
本地化部署架构 = {
    部署模式: {
        单机部署: "所有服务部署在一台服务器",
        容器化: "Docker容器化部署",
        进程管理: "PM2管理Node.js进程",
        服务监控: "内置健康检查机制"
    },
    
    服务集成: {
        单体应用: "前后端分离但部署在一起",
        模块化解耦: "代码层面模块化设计",
        共享数据库: "单一MySQL实例",
        统一配置: "本地配置文件管理"
    },
    
    资源优化: {
        内存管理: "Node.js内存优化配置",
        数据库优化: "MySQL配置调优",
        静态资源: "Nginx静态资源服务",
        缓存策略: "浏览器缓存 + 文件缓存"
    }
};

// 轻量级替代方案
轻量级替代 = {
    缓存替代: {
        Redis替代: "内存对象 + JSON文件",
        缓存策略: "LRU内存缓存算法",
        持久化: "定时写入JSON文件",
        同步机制: "文件锁避免并发问题"
    },
    
    消息队列替代: {
        RabbitMQ替代: "MySQL队列表 + 轮询",
        任务调度: "Node.js定时任务",
        并发控制: "数据库行级锁",
        失败重试: "指数退避重试策略"
    },
    
    文件存储替代: {
        MinIO替代: "本地文件系统存储",
        文件管理: "数据库存储文件元数据",
        访问控制: "Nginx静态资源代理",
        备份策略: "定期文件备份"
    }
};
```

### 8.3 性能扩展策略
```typescript
// 性能扩展策略
性能扩展 = {
    缓存策略: {
        多级缓存: "浏览器缓存 → CDN → 应用缓存 → 数据库缓存",
        缓存更新: "Cache Aside + 消息队列",
        缓存穿透: "布隆过滤器 + 空值缓存",
        缓存雪崩: "随机过期时间 + 熔断机制"
    },
    
    数据库优化: {
        索引优化: "覆盖索引 + 复合索引",
        查询优化: "执行计划分析 + 慢查询优化",
        连接池: "HikariCP连接池优化",
        读写分离: "主从复制 + 读写路由"
    },
    
    异步处理: {
        消息队列: "RabbitMQ + 死信队列",
        异步调用: "@Async注解 + 线程池",
        批量处理: "批量插入 + 批量更新",
        流式处理: "Spring WebFlux + Reactor"
    }
};
```

## 9. 监控运维架构

### 9.1 轻量级监控体系设计
```
本地化监控架构 = {
    基础监控: {
        系统指标: "CPU、内存、磁盘、网络",
        应用指标: "QPS、RT、错误率",
        业务指标: "排课成功率、用户活跃度",
        数据库监控: "MySQL性能、连接数、慢查询"
    },
    
    日志监控: {
        应用日志: "业务操作日志存储到文件",
        错误日志: "异常错误日志文件",
        访问日志: "Nginx访问日志",
        审计日志: "安全审计日志文件"
    },
    
    简单告警: {
        日志告警: "错误日志关键词监控",
        性能告警: "响应时间超时告警",
        磁盘告警: "磁盘空间不足告警",
        邮件通知: "本地SMTP邮件通知"
    },
    
    监控工具: {
        系统监控: "Linux系统命令 + Shell脚本",
        日志分析: "grep/awk/sed日志分析",
        性能监控: "Node.js内置性能监控",
        定时任务: "crontab定时检查任务"
    }
}
```

### 9.2 部署架构
```yaml
# Docker Compose部署配置
deployment:
  docker-compose:
    version: '3.8'
    services:
      nginx:
        image: nginx:alpine
        ports: ["80:80", "443:443"]
        volumes: ["./nginx.conf:/etc/nginx/nginx.conf"]
        depends_on: [frontend, backend]
        
      frontend:
        build: ./frontend
        ports: ["3000:3000"]
        environment: 
          - REACT_APP_API_URL=http://backend:8080
        
      backend:
        build: ./backend
        ports: ["8080:8080"]
        environment:
          - NODE_ENV=production
          - DB_HOST=mysql
          - REDIS_HOST=redis
        depends_on: [mysql, redis]
        
      mysql:
        image: mysql:8.0
        environment:
          - MYSQL_ROOT_PASSWORD=password
          - MYSQL_DATABASE=smart_lab
        volumes: ["mysql_data:/var/lib/mysql"]
        
      redis:
        image: redis:7-alpine
        volumes: ["redis_data:/data"]
        
    volumes:
      mysql_data:
      redis_data:
```

## 10. 技术选型总结

### 10.1 本地化技术栈优势分析
```
本地化技术选型优势 = {
    前端技术栈: {
        React: "组件化开发，生态丰富",
        TypeScript: "类型安全，开发效率高",
        Ant Design Pro: "企业级UI，开箱即用",
        Vite: "构建速度快，开发体验好"
    },
    
    后端技术栈: {
        Node.js: "JavaScript全栈，技能复用",
        Express: "轻量级框架，灵活性高",
        TypeScript: "类型安全，维护性好",
        Sequelize: "ORM框架，数据库无关",
        内存优化: "内置缓存机制，无需Redis"
    },
    
    数据库技术: {
        MySQL: "成熟稳定，高校广泛使用",
        InnoDB: "事务支持，数据安全",
        单实例: "简化部署，维护成本低",
        开源免费: "无授权费用，成本可控"
    },
    
    本地化优势: {
        轻量级: "无需复杂中间件，资源需求低",
        易维护: "单服务器部署，运维简单",
        成本低: "开源技术栈，无商业授权",
        稳定可靠: "成熟技术，高校环境适配"
    }
}
```

### 10.2 架构演进路线
```
架构演进路线 = {
    第一阶段: "单体架构 → 快速开发验证",
    第二阶段: "垂直拆分 → 业务模块分离", 
    第三阶段: "微服务 → 独立部署扩展",
    第四阶段: "云原生 → 容器编排管理"
}
```

这套整体架构方案充分考虑了高校实验室管理的业务特点，通过分层设计、微服务架构、智能算法等先进技术，构建了一个高可用、高性能、可扩展的智慧实验室系统。架构设计既满足了当前需求，也为未来发展预留了充足的扩展空间。