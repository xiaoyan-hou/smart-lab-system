import express from 'express'
import { body } from 'express-validator'
import * as courseController from '../controllers/courseController'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

// 课程验证规则
const courseValidation = [
  body('code')
    .notEmpty()
    .withMessage('课程代码不能为空')
    .isLength({ max: 20 })
    .withMessage('课程代码不能超过20个字符'),
  body('name')
    .notEmpty()
    .withMessage('课程名称不能为空')
    .isLength({ max: 100 })
    .withMessage('课程名称不能超过100个字符'),
  body('credit')
    .notEmpty()
    .withMessage('学分不能为空')
    .isInt({ min: 0, max: 10 })
    .withMessage('学分必须是0-10之间的整数'),
  body('total_hours')
    .notEmpty()
    .withMessage('总学时不能为空')
    .isInt({ min: 1, max: 200 })
    .withMessage('总学时必须是1-200之间的整数'),
  body('department')
    .notEmpty()
    .withMessage('开课院系不能为空')
    .isLength({ max: 50 })
    .withMessage('开课院系不能超过50个字符'),
  body('type')
    .optional()
    .isIn(['theory', 'lab', 'mixed'])
    .withMessage('课程类型必须是theory、lab或mixed'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('课程描述不能超过500个字符')
]

// 公开路由 - 获取课程列表
router.get('/', courseController.getAllCourses)

// 公开路由 - 搜索课程
router.get('/search', courseController.searchCourses)

// 公开路由 - 获取单个课程详情
router.get('/:id', courseController.getCourseById)

// 需要认证的路由
router.use(authenticateToken)

// 创建课程
router.post('/', courseValidation, courseController.createCourse)

// 更新课程
router.put('/:id', courseValidation, courseController.updateCourse)

// 删除课程
router.delete('/:id', courseController.deleteCourse)

export default router