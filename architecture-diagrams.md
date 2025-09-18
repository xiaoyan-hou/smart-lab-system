# 智慧实验室系统架构图集

## 1. 整体架构图（本地化轻量级版）

```mermaid
graph TB
    subgraph "用户接入层"
        Web[Web端 React]
        Mobile[移动端 H5]
        Admin[管理后台]
        API[API接口]
    end
    
    subgraph "接入层"
        Nginx[Nginx Web服务器]
        SSL[SSL证书管理]
    end
    
    subgraph "应用层"
        Auth[用户服务]
        Schedule[排课服务]
        Lab[实验室服务]
        Equipment[设备服务]
        Notify[通知服务]
    end
    
    subgraph "数据层"
        MySQL[(MySQL 数据库)]
        FileCache[(文件缓存)]
        LocalFile[(本地文件存储)]
        TaskQueue[(数据库队列表)]
    end
    
    Web --> Nginx
    Mobile --> Nginx
    Admin --> Nginx
    API --> Nginx
    
    Nginx --> SSL
    Nginx --> Auth
    Nginx --> Schedule
    Nginx --> Lab
    Nginx --> Equipment
    Nginx --> Notify
    
    Auth --> MySQL
    Auth --> FileCache
    Schedule --> MySQL
    Schedule --> FileCache
    Schedule --> TaskQueue
    Lab --> MySQL
    Lab --> FileCache
    Equipment --> MySQL
    Notify --> TaskQueue
    
    MySQL --> LocalFile
    Lab --> FileCache
```

## 2. 智能排课系统架构图（本地化适配版）

```mermaid
graph TB
    subgraph "前端交互层"
        A[排课管理界面]
        B[算法参数配置]
        C[结果展示界面]
    end
    
    subgraph "API接口层"
        D[排课API控制器]
        E[算法API控制器]
        F[结果API控制器]
    end
    
    subgraph "业务逻辑层"
        G[排课服务]
        H[算法引擎]
        I[约束处理器]
        J[结果评估器]
    end
    
    subgraph "数据访问层"
        K[课程数据访问]
        L[教师数据访问]
        M[实验室数据访问]
        N[排课结果存储]
    end
    
    subgraph "算法核心层"
        O[遗传算法引擎]
        P[约束满足引擎]
        Q[多目标优化器]
        R[内存计算框架]
    end
    
    subgraph "本地化存储"
        S[文件缓存]
        T[数据库队列表]
        U[算法结果文件缓存]
        V[约束规则JSON]
    end
    
    A --> D
    B --> E
    C --> F
    
    D --> G
    E --> H
    F --> J
    
    G --> K
    G --> L
    G --> M
    G --> I
    
    H --> O
    H --> P
    H --> Q
    H --> R
    
    I --> S
    J --> N
    
    O --> T
    P --> T
    Q --> U
    R --> S
    
    K --> S
    L --> S
    M --> S
    
    I --> V
    O --> U
    P --> V
```

## 3. 数据库架构图

```mermaid
graph TB
    subgraph "数据库集群"
        subgraph "主库"
            Master[(MySQL Master)]
        end
        
        subgraph "从库"
            Slave1[(MySQL Slave 1)]
            Slave2[(MySQL Slave 2)]
            Slave3[(MySQL Slave 3)]
        end
        
        subgraph "缓存层"
            Redis1[(Redis Master)]
            Redis2[(Redis Slave)]
        end
        
        subgraph "备份策略"
            Backup1[(全量备份)]
            Backup2[(增量备份)]
            Backup3[(binlog备份)]
        end
    end
    
    Master -.复制.-> Slave1
    Master -.复制.-> Slave2
    Master -.复制.-> Slave3
    
    Master --> Backup1
    Master --> Backup2
    Master --> Backup3
    
    Redis1 -.复制.-> Redis2
    
    subgraph "分库策略"
        DB1[(users_db)]
        DB2[(business_db)]
        DB3[(resource_db)]
        DB4[(log_db)]
    end
    
    Master --> DB1
    Master --> DB2
    Master --> DB3
    Master --> DB4
```

## 4. 微服务架构图

```mermaid
graph TB
    subgraph "API Gateway"
        Gateway[API网关]
        AuthFilter[认证过滤器]
        RateLimit[限流器]
        Router[路由分发]
    end
    
    subgraph "用户服务"
        UserAPI[用户API]
        UserService[用户服务]
        UserRepo[用户仓库]
        UserDB[(用户数据库)]
    end
    
    subgraph "排课服务"
        ScheduleAPI[排课API]
        ScheduleService[排课服务]
        Algorithm[排课算法]
        ScheduleRepo[排课仓库]
        ScheduleDB[(排课数据库)]
        RedisCache[(Redis缓存)]
    end
    
    subgraph "实验室服务"
        LabAPI[实验室API]
        LabService[实验室服务]
        LabRepo[实验室仓库]
        LabDB[(实验室数据库)]
    end
    
    subgraph "设备服务"
        EquipmentAPI[设备API]
        EquipmentService[设备服务]
        EquipmentRepo[设备仓库]
        EquipmentDB[(设备数据库)]
    end
    
    subgraph "通知服务"
        NotifyAPI[通知API]
        NotifyService[通知服务]
        MessageQueue[消息队列]
        EmailService[邮件服务]
    end
    
    Gateway --> AuthFilter
    AuthFilter --> RateLimit
    RateLimit --> Router
    
    Router --> UserAPI
    Router --> ScheduleAPI
    Router --> LabAPI
    Router --> EquipmentAPI
    Router --> NotifyAPI
    
    UserAPI --> UserService
    UserService --> UserRepo
    UserRepo --> UserDB
    
    ScheduleAPI --> ScheduleService
    ScheduleService --> Algorithm
    ScheduleService --> ScheduleRepo
    ScheduleRepo --> ScheduleDB
    ScheduleService --> RedisCache
    
    LabAPI --> LabService
    LabService --> LabRepo
    LabRepo --> LabDB
    
    EquipmentAPI --> EquipmentService
    EquipmentService --> EquipmentRepo
    EquipmentRepo --> EquipmentDB
    
    NotifyAPI --> NotifyService
    NotifyService --> MessageQueue
    MessageQueue --> EmailService
```

## 5. 安全架构图

```mermaid
graph TB
    subgraph "网络安全层"
        DDoS[DDoS防护]
        WAF[Web应用防火墙]
        SSL[SSL/TLS加密]
        VPC[VPC网络隔离]
    end
    
    subgraph "应用安全层"
        Auth[身份认证]
        RBAC[权限控制]
        Input[输入验证]
        XSS[XSS防护]
    end
    
    subgraph "数据安全层"
        Encryption[数据加密]
        Masking[数据脱敏]
        Access[访问控制]
        Backup[备份加密]
    end
    
    subgraph "系统安全层"
        OS[操作系统安全]
        Container[容器安全]
        Audit[安全审计]
        Monitor[安全监控]
    end
    
    DDoS --> WAF
    SSL --> Auth
    VPC --> RBAC
    
    Auth --> Encryption
    RBAC --> Access
    Input --> Masking
    XSS --> Encryption
    
    Encryption --> OS
    Access --> Container
    Backup --> Audit
    
    OS --> Monitor
    Container --> Monitor
    Audit --> Monitor
```

## 6. 部署架构图

```mermaid
graph TB
    subgraph "用户访问层"
        Users[用户]
        DNS[DNS解析]
        CDN[CDN加速]
    end
    
    subgraph "负载均衡层"
        LB1[Nginx负载均衡1]
        LB2[Nginx负载均衡2]
        VIP[虚拟IP]
    end
    
    subgraph "应用服务层"
        App1[应用服务器1]
        App2[应用服务器2]
        App3[应用服务器3]
    end
    
    subgraph "数据存储层"
        DBMaster[(MySQL主库)]
        DBSlave1[(MySQL从库1)]
        DBSlave2[(MySQL从库2)]
        RedisCluster[Redis集群]
    end
    
    subgraph "文件存储层"
        File1[文件服务器1]
        File2[文件服务器2]
        FileCluster[分布式文件系统]
    end
    
    Users --> DNS
    DNS --> CDN
    CDN --> VIP
    
    VIP --> LB1
    VIP --> LB2
    
    LB1 --> App1
    LB1 --> App2
    LB2 --> App2
    LB2 --> App3
    
    App1 --> DBMaster
    App1 --> RedisCluster
    App2 --> DBSlave1
    App2 --> RedisCluster
    App3 --> DBSlave2
    App3 --> RedisCluster
    
    App1 --> File1
    App2 --> FileCluster
    App3 --> File2
```

## 7. 智能排课算法流程图

```mermaid
graph TD
    Start([开始排课]) --> Input[输入排课数据]
    Input --> Validate[数据验证]
    
    Validate --> InitPopulation[初始化种群]
    InitPopulation --> Evaluate[评估适应度]
    
    Evaluate --> CheckConvergence{检查收敛}
    CheckConvergence -->|未收敛| Selection[选择操作]
    CheckConvergence -->|已收敛| OptResult[优化结果]
    
    Selection --> Crossover[交叉操作]
    Crossover --> Mutation[变异操作]
    Mutation --> LocalSearch[局部搜索]
    LocalSearch --> Evaluate
    
    OptResult --> ValidateResult[结果验证]
    ValidateResult --> CheckConflicts{检查冲突}
    
    CheckConflicts -->|有冲突| ResolveConflicts[冲突解决]
    CheckConflicts -->|无冲突| FinalResult[最终排课结果]
    
    ResolveConflicts --> ValidateResult
    FinalResult --> SaveSchedule[保存排课结果]
    SaveSchedule --> Notify[通知相关人员]
    Notify --> End([结束])
    
    subgraph "约束检查"
        Validate --> HardConstraints[硬约束检查]
        Validate --> SoftConstraints[软约束评估]
        HardConstraints --> TimeConflict[时间冲突检测]
        HardConstraints --> CapacityCheck[容量检查]
        SoftConstraints --> TeacherPref[教师偏好]
        SoftConstraints --> TimeDistribution[时间分布]
    end
```

## 8. 系统时序图

### 用户登录时序图
```mermaid
sequenceDiagram
    participant User as 用户
    participant Frontend as 前端
    participant Gateway as API网关
    participant Auth as 认证服务
    participant UserService as 用户服务
    participant Redis as Redis缓存
    participant MySQL as MySQL数据库
    
    User->>Frontend: 输入用户名密码
    Frontend->>Frontend: 表单验证
    Frontend->>Gateway: POST /api/v1/auth/login
    Gateway->>Auth: 转发登录请求
    Auth->>UserService: 验证用户信息
    UserService->>MySQL: 查询用户信息
    MySQL-->>UserService: 返回用户数据
    UserService->>UserService: 密码验证
    UserService-->>Auth: 验证结果
    Auth->>Auth: 生成JWT Token
    Auth->>Redis: 缓存Token信息
    Auth-->>Gateway: 返回Token
    Gateway-->>Frontend: 登录成功响应
    Frontend->>Frontend: 保存Token到localStorage
    Frontend-->>User: 跳转到主页
```

### 智能排课时序图
```mermaid
sequenceDiagram
    participant Teacher as 教师
    participant Frontend as 前端
    participant Gateway as API网关
    participant Schedule as 排课服务
    participant Algorithm as 排课算法
    participant Queue as 消息队列
    participant MySQL as MySQL数据库
    participant Redis as Redis缓存
    
    Teacher->>Frontend: 点击自动排课
    Frontend->>Frontend: 参数验证
    Frontend->>Gateway: POST /api/v1/scheduling/auto
    Gateway->>Schedule: 转发排课请求
    Schedule->>MySQL: 获取排课数据
    MySQL-->>Schedule: 返回数据
    Schedule->>Queue: 发送排课任务
    Queue-->>Schedule: 任务ID
    Schedule-->>Gateway: 返回任务ID
    Gateway-->>Frontend: 返回任务状态
    
    par 异步处理
        Queue->>Algorithm: 消费排课任务
        Algorithm->>Algorithm: 执行遗传算法
        Algorithm->>Redis: 更新进度
        Algorithm->>MySQL: 保存排课结果
        Algorithm->>Queue: 发送完成通知
    end
    
    Frontend->>Gateway: GET /api/v1/scheduling/{id}/progress
    Gateway->>Schedule: 查询进度
    Schedule->>Redis: 获取进度信息
    Redis-->>Schedule: 返回进度
    Schedule-->>Gateway: 返回进度
    Gateway-->>Frontend: 显示进度
    
    Frontend-->>Teacher: 显示排课结果
```

## 9. 数据流图

### 排课数据流图
```mermaid
graph LR
    subgraph "数据源"
        Courses[课程数据]
        Labs[实验室数据]
        Teachers[教师数据]
        Students[学生数据]
        Constraints[约束条件]
    end
    
    subgraph "数据处理"
        Preprocess[数据预处理]
        Validate[数据验证]
        Normalize[数据标准化]
        Index[索引构建]
    end
    
    subgraph "算法处理"
        Algorithm[排课算法]
        Fitness[适应度计算]
        Selection[选择操作]
        Crossover[交叉操作]
        Mutation[变异操作]
    end
    
    subgraph "结果输出"
        Schedule[排课结果]
        Conflicts[冲突报告]
        Statistics[统计信息]
        Recommendations[优化建议]
    end
    
    Courses --> Preprocess
    Labs --> Preprocess
    Teachers --> Preprocess
    Students --> Preprocess
    Constraints --> Preprocess
    
    Preprocess --> Validate
    Validate --> Normalize
    Normalize --> Index
    Index --> Algorithm
    
    Algorithm --> Fitness
    Fitness --> Selection
    Selection --> Crossover
    Crossover --> Mutation
    Mutation --> Fitness
    
    Algorithm --> Schedule
    Algorithm --> Conflicts
    Schedule --> Statistics
    Conflicts --> Recommendations
```

## 10. 网络拓扑图

```mermaid
graph TB
    subgraph "互联网"
        Internet[互联网]
    end
    
    subgraph "DMZ区域"
        Firewall[防火墙]
        WAF[WAF防护]
        LB[负载均衡器]
    end
    
    subgraph "应用服务区"
        Web1[Web服务器1]
        Web2[Web服务器2]
        App1[应用服务器1]
        App2[应用服务器2]
    end
    
    subgraph "数据服务区"
        DBProxy[数据库代理]
        MySQL1[MySQL主库]
        MySQL2[MySQL从库1]
        MySQL3[MySQL从库2]
        Redis1[Redis主节点]
        Redis2[Redis从节点]
    end
    
    subgraph "管理区"
        Monitor[监控系统]
        Log[日志系统]
        Backup[备份系统]
    end
    
    Internet --> Firewall
    Firewall --> WAF
    WAF --> LB
    
    LB --> Web1
    LB --> Web2
    Web1 --> App1
    Web2 --> App2
    
    App1 --> DBProxy
    App2 --> DBProxy
    DBProxy --> MySQL1
    DBProxy --> MySQL2
    DBProxy --> MySQL3
    
    App1 --> Redis1
    App2 --> Redis1
    Redis1 -.复制.-> Redis2
    
    MySQL1 --> Backup
    Monitor -.监控.-> Web1
    Monitor -.监控.-> Web2
    Monitor -.监控.-> App1
    Monitor -.监控.-> App2
    
    Log -.收集.-> Web1
    Log -.收集.-> Web2
    Log -.收集.-> App1
    Log -.收集.-> App2
```

这些架构图清晰展示了智慧实验室系统的整体架构设计，包括系统分层、微服务架构、数据库设计、安全架构、部署方案等关键组成部分。通过可视化的方式，帮助开发团队和项目相关方更好地理解系统架构，为后续的开发实施提供清晰的指导。