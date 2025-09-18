import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes';
import teacherRoutes from './routes/teacherRoutes';
import courseRoutes from './routes/courses';
import labRoutes from './routes/labs';
import equipmentRoutes from './routes/equipment';
import classRoutes from './routes/classes';
import courseOfferingRoutes from './routes/courseOfferings';
import { errorHandler } from './middleware/validation';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 基础路由
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: '智慧实验室系统后端服务运行正常',
    timestamp: new Date().toISOString()
  });
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/labs', labRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/course-offerings', courseOfferingRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: '接口不存在' });
});

// 错误处理中间件
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 智慧实验室系统后端服务运行在端口 ${PORT}`);
  console.log(`📊 健康检查接口: http://localhost:${PORT}/api/health`);
});