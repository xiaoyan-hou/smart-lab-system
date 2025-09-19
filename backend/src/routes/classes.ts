import express from 'express'
import { body } from 'express-validator'
import * as classController from '../controllers/classController'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

// 班级验证规则
const classValidation = [
  body('name')
    .notEmpty()
    .withMessage('班级名称不能为空')
    .isLength({ max: 100 })
    .withMessage('班级名称不能超过100个字符'),
  body('department')
    .notEmpty()
    .withMessage('所属院系不能为空')
    .isLength({ max: 50 })
    .withMessage('所属院系不能超过50个字符'),
  body('major')
    .notEmpty()
    .withMessage('专业不能为空')
    .isLength({ max: 50 })
    .withMessage('专业不能超过50个字符'),
  body('grade')
    .notEmpty()
    .withMessage('年级不能为空')
    .isLength({ max: 10 })
    .withMessage('年级不能超过10个字符'),
  body('class_number')
    .notEmpty()
    .withMessage('班级号不能为空')
    .isLength({ max: 10 })
    .withMessage('班级号不能超过10个字符'),
  body('student_count')
    .notEmpty()
    .withMessage('学生人数不能为空')
    .isInt({ min: 1, max: 200 })
    .withMessage('学生人数必须是1-200之间的整数'),
  body('head_teacher')
    .optional()
    .isLength({ max: 50 })
    .withMessage('班主任姓名不能超过50个字符'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('班级描述不能超过500个字符'),
  body('status')
    .optional()
    .isIn(['active', 'graduated', 'inactive'])
    .withMessage('状态必须是active、graduated或inactive')
]

// 公开路由 - 获取班级列表
router.get('/', classController.getAllClasses)

// 公开路由 - 获取单个班级详情
router.get('/:id', classController.getClassById)

// 公开路由 - 获取班级统计信息
// router.get('/stats/classes', classController.getClassStats)

// 需要认证的路由
router.use(authenticateToken)

// 创建班级
router.post('/', classValidation, classController.createClass)

// 更新班级
router.put('/:id', classValidation, classController.updateClass)

// 删除班级
router.delete('/:id', classController.deleteClass)

export default router