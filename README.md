# 智慧实验室系统

一套专为高校设计的智能化实验室管理与排课系统，通过先进的算法优化实验室资源配置，提升教学管理效率。

## 🎯 项目特色

### 智能排课核心
- **遗传算法 + CSP**: 采用遗传算法与约束满足问题相结合的混合优化策略
- **多目标优化**: 同时考虑时间冲突、容量匹配、设备需求、教师偏好等多重约束
- **实时冲突检测**: 动态识别并解决排课冲突，支持自动和手动调整
- **性能优化**: 支持并行计算、缓存优化，处理大规模排课任务

### 本地化部署优势
- **轻量级架构**: 专为资源有限的二本高校设计，无需Redis、RabbitMQ等中间件
- **单服务器部署**: 一台服务器即可运行，降低硬件成本
- **开源技术栈**: 完全基于开源技术，无商业授权费用
- **简易维护**: 减少组件依赖，降低运维复杂度

### 用户体验
- **直观可视化**: 丰富的图表展示，排课结果一目了然
- **灵活配置**: 支持自定义约束规则和优化参数
- **多端适配**: 响应式设计，支持PC和移动端访问
- **操作便捷**: 拖拽式手动调整，批量操作支持

## 🏗️ 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端层        │    │   网关层        │    │   服务层        │
│  React 18       │◄──►│  Nginx          │◄──►│  用户服务       │
│  Ant Design Pro │    │  负载均衡       │    │  排课服务       │
│  TypeScript     │    │  反向代理       │    │  实验室服务     │
└─────────────────┘    └─────────────────┘    │  设备服务       │
                                              └─────────────────┘
                                                      │
                                              ┌─────────────────┐
                                              │   数据层        │
                                              │  MySQL 8.0      │
                                              │  Redis          │
                                              └─────────────────┘
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16.0.0
- MySQL >= 8.0
- Redis >= 6.0
- Docker (可选)

### 1. 克隆项目
```bash
git clone https://github.com/your-username/smart-lab-system.git
cd smart-lab-system
```

### 2. 环境配置
```bash
# 复制环境配置
cp backend/.env.example backend/.env

# 编辑配置文件，配置数据库连接等信息
vim backend/.env
```

### 3. 数据库初始化
```bash
cd backend
npm install
npm run db:migrate
npm run db:seed
```

### 4. 启动服务
```bash
# 启动后端服务
npm run dev

# 新终端，启动前端服务
cd frontend
npm install
npm run dev
```

### 5. Docker一键部署（推荐）
```bash
docker-compose -f docker/docker-compose.yml up -d
```

访问地址：
- 前端: http://localhost:3000
- 后端API: http://localhost:8080
- 数据库管理: http://localhost:8081

## 📊 核心功能

### 智能排课系统
- **自动排课**: 基于遗传算法的智能排课，支持多约束条件
- **手动调整**: 可视化拖拽调整，实时冲突检测
- **冲突解决**: 自动识别时间冲突、容量超限、设备缺失等问题
- **结果导出**: 支持Excel、PDF格式导出排课结果

### 实验室管理
- **资源管理**: 实验室信息、容量、设备配置管理
- **状态监控**: 实时显示实验室使用状态
- **预约系统**: 支持教师预约实验室
- **统计分析**: 实验室利用率、使用趋势分析

### 课程管理
- **课程信息**: 课程基本信息、学时、人数管理
- **教师安排**: 教师与课程关联管理
- **学期设置**: 支持多学期、多年度管理
- **课程导入**: 批量导入课程信息

### 设备管理
- **设备台账**: 设备基本信息、采购、保修管理
- **状态跟踪**: 设备使用状态、维修记录
- **预约管理**: 设备预约与使用统计
- **维护提醒**: 定期维护提醒与记录

### 用户权限
- **角色管理**: 管理员、教师、学生多角色支持
- **权限控制**: 基于RBAC的细粒度权限控制
- **单点登录**: JWT Token认证机制
- **操作日志**: 完整的操作审计日志

## 🛠️ 技术栈

### 前端技术
- **React 18**: 现代化的前端框架
- **TypeScript**: 类型安全的JavaScript
- **Ant Design Pro**: 企业级UI组件库
- **Redux Toolkit**: 状态管理
- **ECharts**: 数据可视化
- **Axios**: HTTP请求库

### 后端技术
- **Node.js**: 高性能JavaScript运行时
- **Express**: Web应用框架
- **TypeScript**: 类型安全的开发
- **Sequelize**: ORM框架
- **JWT**: 身份认证
- **Socket.io**: 实时通信

### 数据存储
- **MySQL 8.0**: 主数据库（单实例，本地化部署）
- **缓存**: 文件缓存 + 内存缓存（无需Redis）

### 基础设施
- **Docker**: 容器化部署（轻量级配置）
- **Nginx**: 反向代理与负载均衡
- **PM2**: 进程管理
- **Winston**: 日志管理

## 📈 性能指标

### 排课性能
- **并发处理**: 支持1000+课程同时排课
- **响应时间**: 平均响应时间 < 3秒
- **成功率**: 排课成功率 > 95%
- **算法收敛**: 通常50-100代内收敛

### 系统性能
- **并发用户**: 支持500+并发用户
- **API响应**: 平均响应时间 < 200ms
- **数据库查询**: 主要查询 < 100ms
- **内存使用**: 单实例 < 512MB

## 🔧 配置说明

### 环境变量配置
```bash
# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=smart_lab
DB_USER=root
DB_PASSWORD=password

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# 算法参数
GENETIC_POPULATION_SIZE=100
GENETIC_MAX_GENERATIONS=500
GENETIC_MUTATION_RATE=0.1

# 系统配置
NODE_ENV=development
PORT=8080
LOG_LEVEL=info
```

### 算法参数调优
```typescript
// 排课算法参数配置
const algorithmConfig = {
    // 遗传算法参数
    genetic: {
        populationSize: 100,        // 种群大小
        maxGenerations: 500,        // 最大迭代次数
        mutationRate: 0.1,           // 变异率
        crossoverRate: 0.8,        // 交叉率
        elitismRate: 0.1             // 精英保留率
    },
    
    // 约束权重
    constraints: {
        hardConstraintPenalty: 1000,  // 硬约束惩罚权重
        softConstraintPenalty: 100,    // 软约束惩罚权重
        timeConflict: 1000,            // 时间冲突惩罚
        capacityOverflow: 1000,        // 容量超限惩罚
        equipmentMissing: 500,         // 设备缺失惩罚
        teacherConflict: 800           // 教师冲突惩罚
    },
    
    // 优化目标权重
    objectives: {
        utilizationWeight: 10,         // 利用率权重
        distributionWeight: 5,         // 分布均匀性权重
        preferenceWeight: 3,         // 偏好满足权重
        balanceWeight: 2               // 平衡性权重
    }
};
```

## 📚 文档资料

### 详细文档
- [架构设计](architecture-design.md) - 系统整体架构设计
- [项目结构](project-structure.md) - 项目目录结构说明
- [技术实现](technical-details.md) - 核心技术实现细节

### API文档
启动服务后访问：http://localhost:8080/api-docs

### 部署指南
- [开发环境部署](docs/deployment/development.md)
- [生产环境部署](docs/deployment/production.md)
- [Docker部署](docs/deployment/docker.md)

## 🤝 贡献指南

我们欢迎社区贡献！请查看我们的[贡献指南](CONTRIBUTING.md)了解如何参与项目开发。

### 开发流程
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📝 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解项目的更新历史。

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🆘 支持

如遇到问题，请通过以下方式获取支持：

- 📧 邮箱支持: support@smart-lab.com
- 💬 社区讨论: [GitHub Discussions](https://github.com/your-username/smart-lab-system/discussions)
- 🐛 问题报告: [GitHub Issues](https://github.com/your-username/smart-lab-system/issues)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者和用户！

---

**⭐ 如果这个项目对你有帮助，请给我们一个星标！**