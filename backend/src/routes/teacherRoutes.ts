import express from 'express';
import { body } from 'express-validator';
import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher
} from '../controllers/teacherController';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';

const router = express.Router();

/**
 * @route   GET /api/teachers
 * @desc    获取教师列表
 * @access  Private
 */
router.get('/', authenticateToken, getTeachers);

/**
 * @route   GET /api/teachers/:id
 * @desc    获取教师详情
 * @access  Private
 */
router.get('/:id', authenticateToken, getTeacherById);

/**
 * @route   POST /api/teachers
 * @desc    创建教师
 * @access  Private/Admin
 */
router.post('/', authenticateToken, requireAdmin, [
  body('teacher_id').notEmpty().withMessage('教师工号不能为空').isLength({ min: 3 }).withMessage('教师工号至少3位'),
  body('name').notEmpty().withMessage('教师姓名不能为空'),
  body('department').optional().isLength({ max: 255 }).withMessage('院系名称过长'),
  body('title').optional().isLength({ max: 50 }).withMessage('职称过长')
], validateRequest, createTeacher);

/**
 * @route   PUT /api/teachers/:id
 * @desc    更新教师信息
 * @access  Private/Admin
 */
router.put('/:id', authenticateToken, requireAdmin, [
  body('teacher_id').optional().isLength({ min: 3 }).withMessage('教师工号至少3位'),
  body('name').optional().notEmpty().withMessage('教师姓名不能为空'),
  body('department').optional().isLength({ max: 255 }).withMessage('院系名称过长'),
  body('title').optional().isLength({ max: 50 }).withMessage('职称过长')
], validateRequest, updateTeacher);

/**
 * @route   DELETE /api/teachers/:id
 * @desc    删除教师
 * @access  Private/Admin
 */
router.delete('/:id', authenticateToken, requireAdmin, deleteTeacher);

export default router;