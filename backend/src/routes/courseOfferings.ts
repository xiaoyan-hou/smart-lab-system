import express from 'express'
import { body } from 'express-validator'
import * as courseOfferingController from '../controllers/courseOfferingController'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

// 开课信息验证规则
const courseOfferingValidation = [
  body('course_id')
    .notEmpty()
    .withMessage('课程ID不能为空')
    .isInt({ min: 1 })
    .withMessage('课程ID必须是正整数'),
  body('teacher_id')
    .notEmpty()
    .withMessage('教师ID不能为空')
    .isInt({ min: 1 })
    .withMessage('教师ID必须是正整数'),
  body('semester')
    .notEmpty()
    .withMessage('学期不能为空')
    .isIn(['spring', 'summer', 'fall'])
    .withMessage('学期必须是spring、summer或fall'),
  body('academic_year')
    .notEmpty()
    .withMessage('学年不能为空')
    .isLength({ max: 20 })
    .withMessage('学年不能超过20个字符'),
  body('max_students')
    .notEmpty()
    .withMessage('最大学生数不能为空')
    .isInt({ min: 1, max: 200 })
    .withMessage('最大学生数必须是1-200之间的整数'),
  body('lab_hours')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('实验学时必须是0-100之间的整数'),
  body('theory_hours')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('理论学时必须是0-100之间的整数'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('开课描述不能超过500个字符'),
  body('status')
    .optional()
    .isIn(['active', 'inactive', 'completed'])
    .withMessage('状态必须是active、inactive或completed')
]

// 班级关联验证规则
const classRelationValidation = [
  body('class_id')
    .notEmpty()
    .withMessage('班级ID不能为空')
    .isInt({ min: 1 })
    .withMessage('班级ID必须是正整数')
]

// 公开路由 - 获取开课信息列表
router.get('/', courseOfferingController.getAllCourseOfferings)

// 公开路由 - 获取单个开课信息详情
router.get('/:id', courseOfferingController.getCourseOfferingById)

// 公开路由 - 获取开课信息的班级列表
router.get('/:id/classes', courseOfferingController.getCourseOfferingClasses)

// 需要认证的路由
router.use(authenticateToken)

// 创建开课信息
router.post('/', courseOfferingValidation, courseOfferingController.createCourseOffering)

// 更新开课信息
router.put('/:id', courseOfferingValidation, courseOfferingController.updateCourseOffering)

// 删除开课信息
router.delete('/:id', courseOfferingController.deleteCourseOffering)

// 添加班级到开课信息
router.post('/:id/classes', classRelationValidation, courseOfferingController.addClassToCourseOffering)

// 从开课信息移除班级
router.delete('/:id/classes/:classId', courseOfferingController.removeClassFromCourseOffering)

export default router