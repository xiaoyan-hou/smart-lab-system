# 智慧实验室系统 - 后端API文档

## 基础信息
- 基础URL: `http://localhost:3001/api`
- 认证方式: JWT Bearer Token
- 响应格式: JSON

## 认证相关接口

### 1. 用户登录
**POST** `/auth/login`

**请求体:**
```json
{
  "username": "admin",
  "password": "123456"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "role": "admin"
    }
  }
}
```

### 2. 获取当前用户信息
**GET** `/auth/me`

**请求头:**
```
Authorization: Bearer <token>
```

**响应示例:**
```json
{
  "success": true,
  "message": "获取用户信息成功",
  "data": {
    "id": 1,
    "username": "admin",
    "name": "管理员",
    "role": "admin"
  }
}
```

### 3. 获取用户列表（管理员）
**GET** `/auth/users`

**请求头:**
```
Authorization: Bearer <token>
```

**查询参数:**
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)
- `role`: 角色筛选 (admin/teacher/student)

### 4. 创建用户（管理员）
**POST** `/auth/users`

**请求头:**
```
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "username": "teacher001",
  "password": "123456",
  "name": "张老师",
  "role": "teacher"
}
```

## 教师管理接口

### 1. 获取教师列表
**GET** `/teachers`

**请求头:**
```
Authorization: Bearer <token>
```

**查询参数:**
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)
- `department`: 院系筛选
- `title`: 职称筛选

### 2. 获取教师详情
**GET** `/teachers/:id`

**请求头:**
```
Authorization: Bearer <token>
```

### 3. 创建教师
**POST** `/teachers`

**请求头:**
```
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "teacher_id": "T001",
  "name": "张老师",
  "department": "计算机学院",
  "title": "教授"
}
```

### 4. 更新教师信息
**PUT** `/teachers/:id`

**请求头:**
```
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "teacher_id": "T001",
  "name": "张老师",
  "department": "计算机学院",
  "title": "副教授"
}
```

### 5. 删除教师
**DELETE** `/teachers/:id`

**请求头:**
```
Authorization: Bearer <token>
```

## 响应格式说明

### 成功响应
```json
{
  "success": true,
  "message": "操作成功",
  "data": {} // 具体数据
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息",
  "data": null // 或错误详情
}
```

## 状态码说明
- `200`: 请求成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未认证/令牌无效
- `403`: 权限不足
- `404`: 资源不存在
- `500`: 服务器内部错误

## 角色权限说明
- **admin**: 管理员，拥有所有权限
- **teacher**: 教师，可查看和操作相关教学资源
- **student**: 学生，有限的查看权限

## 测试用户
- 管理员: username=`admin`, password=`123456`
- 教师: username=`teacher001`, password=`123456`
- 学生: username=`student001`, password=`123456`