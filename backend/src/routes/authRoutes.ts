import express from 'express';
import { body } from 'express-validator';
import { login, getCurrentUser, getUsers, createUserController } from '../controllers/authController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    用户登录
 * @access  Public
 */
router.post('/login', [
  body('username').notEmpty().withMessage('用户名不能为空'),
  body('password').notEmpty().withMessage('密码不能为空').isLength({ min: 6 }).withMessage('密码至少6位')
], validateRequest, login);

/**
 * @route   GET /api/auth/me
 * @desc    获取当前用户信息
 * @access  Private
 */
router.get('/me', authenticateToken, getCurrentUser);

/**
 * @route   GET /api/auth/users
 * @desc    获取用户列表（管理员）
 * @access  Private/Admin
 */
router.get('/users', authenticateToken, requireAdmin, getUsers);

/**
 * @route   POST /api/auth/users
 * @desc    创建用户（管理员）
 * @access  Private/Admin
 */
router.post('/users', authenticateToken, requireAdmin, [
  body('username').notEmpty().withMessage('用户名不能为空').isLength({ min: 3 }).withMessage('用户名至少3位'),
  body('password').notEmpty().withMessage('密码不能为空').isLength({ min: 6 }).withMessage('密码至少6位'),
  body('name').notEmpty().withMessage('姓名不能为空'),
  body('role').isIn(['admin', 'teacher', 'student']).withMessage('无效的角色')
], validateRequest, createUserController);

export default router;