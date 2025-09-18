import express from 'express'
import { body } from 'express-validator'
import * as labController from '../controllers/labController'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

// 实验室验证规则
const labValidation = [
  body('name')
    .notEmpty()
    .withMessage('实验室名称不能为空')
    .isLength({ max: 100 })
    .withMessage('实验室名称不能超过100个字符'),
  body('building')
    .notEmpty()
    .withMessage('所在楼宇不能为空')
    .isLength({ max: 50 })
    .withMessage('所在楼宇不能超过50个字符'),
  body('floor')
    .notEmpty()
    .withMessage('楼层不能为空')
    .isInt({ min: 1, max: 20 })
    .withMessage('楼层必须是1-20之间的整数'),
  body('room_number')
    .notEmpty()
    .withMessage('房间号不能为空')
    .isLength({ max: 20 })
    .withMessage('房间号不能超过20个字符'),
  body('capacity')
    .notEmpty()
    .withMessage('容纳人数不能为空')
    .isInt({ min: 1, max: 200 })
    .withMessage('容纳人数必须是1-200之间的整数'),
  body('lab_type')
    .optional()
    .isIn(['general', 'specialized', 'research'])
    .withMessage('实验室类型必须是general、specialized或research'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('实验室描述不能超过500个字符'),
  body('equipment_count')
    .optional()
    .isInt({ min: 0 })
    .withMessage('设备数量必须是非负整数'),
  body('status')
    .optional()
    .isIn(['active', 'maintenance', 'inactive'])
    .withMessage('状态必须是active、maintenance或inactive')
]

// 公开路由 - 获取实验室列表
router.get('/', labController.getAllLabs)

// 公开路由 - 获取单个实验室详情
router.get('/:id', labController.getLabById)

// 公开路由 - 获取实验室设备列表
router.get('/:id/equipment', labController.getLabEquipment)

// 需要认证的路由
router.use(authenticateToken)

// 创建实验室
router.post('/', labValidation, labController.createLab)

// 更新实验室
router.put('/:id', labValidation, labController.updateLab)

// 删除实验室
router.delete('/:id', labController.deleteLab)

export default router