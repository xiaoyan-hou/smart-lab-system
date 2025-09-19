# ESLint 规则配置说明

## 已配置的 ESLint 文件

### 1. 后端配置 (`backend/.eslintrc.js`)
- TypeScript 专用规则
- Node.js 环境配置
- 数据库查询安全规则
- 文件命名规范

### 2. 前端配置 (`frontend/.eslintrc.js`)
- React 和 TypeScript 规则
- JSX 语法支持
- React Hooks 规则
- 组件命名规范

### 3. 项目根配置 (`.eslintrc.js`)
- 通用规则配置
- 子项目规则继承
- 全局环境配置

## 核心规则说明

### 强制规则 (Error Level)
1. **分号要求** (`@typescript-eslint/semi`)
   - 所有语句必须以分号结尾
   - 自动修复支持

2. **禁止使用 var** (`no-var`)
   - 强制使用 const 或 let
   - 自动修复支持

3. **类型声明** (`@typescript-eslint/explicit-function-return-type`)
   - 所有函数必须声明返回类型
   - 提高代码可维护性

4. **SQL 注入防护** (`no-concatenated-sql`)
   - 禁止字符串拼接 SQL
   - 强制使用参数化查询

### 警告规则 (Warning Level)
1. **命名规范** (`@typescript-eslint/naming-convention`)
   - 变量: camelCase 或 UPPER_CASE
   - 函数: camelCase
   - 接口: PascalCase，建议 I 前缀

2. **代码格式**
   - 缩进: 2 个空格
   - 括号: K&R 风格
   - 空格: 运算符前后必须有空格

3. **文件命名** (`filenames/match-regex`)
   - 小写字母、数字、连字符
   - 控制器: `.controller.ts`
   - 模型: `.model.ts`
   - 中间件: `.middleware.ts`

## 使用方法

### 检查代码
```bash
# 检查所有项目
npm run lint

# 检查后端的
npm run lint:backend

# 检查前端
npm run lint:frontend
```

### 自动修复
```bash
# 修复所有项目
npm run lint:fix

# 修复后端
npm run lint:fix:backend

# 修复前端
npm run lint:fix:frontend
```

### 单独检查文件
```bash
# 后端
cd backend && npx eslint src/models/userModel.ts

# 前端
cd frontend && npx eslint src/components/UserList.tsx
```

## 集成建议

### 1. VS Code 集成
安装插件：
- ESLint
- TypeScript Hero
- Prettier - Code formatter

### 2. Git 预提交钩子
```bash
# 安装 husky
npm install husky --save-dev

# 添加预提交钩子
npx husky add .husky/pre-commit "npm run lint"
```

### 3. CI/CD 集成
在构建流程中添加：
```yaml
- name: Lint Check
  run: npm run lint
```

## 自定义规则

如需添加新的 ESLint 规则：

1. 在对应的 `.eslintrc.js` 文件中添加规则
2. 使用 `error` 级别强制要求
3. 使用 `warn` 级别作为建议
4. 配置自动修复（如果支持）

示例：
```javascript
rules: {
  'your-custom-rule': 'error',
  'another-rule': ['warn', { option: 'value' }]
}
```

## 忽略文件

使用 `.eslintignore` 文件排除不需要检查的文件：
- node_modules/
- 构建输出目录
- 日志文件
- 环境变量文件
- IDE 配置文件