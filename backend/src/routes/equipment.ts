import express from 'express'
import { body } from 'express-validator'
import * as equipmentController from '../controllers/equipmentController'
import { authenticateToken } from '../middleware/auth'

const router = express.Router()

// 设备验证规则
const equipmentValidation = [
  body('name')
    .notEmpty()
    .withMessage('设备名称不能为空')
    .isLength({ max: 100 })
    .withMessage('设备名称不能超过100个字符'),
  body('model')
    .notEmpty()
    .withMessage('设备型号不能为空')
    .isLength({ max: 100 })
    .withMessage('设备型号不能超过100个字符'),
  body('serial_number')
    .notEmpty()
    .withMessage('设备序列号不能为空')
    .isLength({ max: 100 })
    .withMessage('设备序列号不能超过100个字符'),
  body('lab_id')
    .notEmpty()
    .withMessage('所属实验室不能为空')
    .isInt({ min: 1 })
    .withMessage('所属实验室ID必须是正整数'),
  body('category')
    .notEmpty()
    .withMessage('设备类别不能为空')
    .isLength({ max: 50 })
    .withMessage('设备类别不能超过50个字符'),
  body('manufacturer')
    .notEmpty()
    .withMessage('制造商不能为空')
    .isLength({ max: 100 })
    .withMessage('制造商不能超过100个字符'),
  body('purchase_date')
    .optional()
    .isISO8601()
    .withMessage('购买日期必须是有效的ISO日期格式'),
  body('purchase_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('购买价格必须是非负数'),
  body('status')
    .optional()
    .isIn(['active', 'maintenance', 'damaged', 'retired'])
    .withMessage('状态必须是active、maintenance、damaged或retired'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('设备描述不能超过500个字符'),
  body('specifications')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('技术规格不能超过1000个字符')
]

// 公开路由 - 获取设备列表
router.get('/', equipmentController.getAllEquipments)

// 公开路由 - 获取单个设备详情
router.get('/:id', equipmentController.getEquipmentById)

// 公开路由 - 获取设备统计信息
router.get('/stats/equipment', equipmentController.getEquipmentStats)

// 需要认证的路由
router.use(authenticateToken)

// 创建设备
router.post('/', equipmentValidation, equipmentController.createEquipment)

// 更新设备
router.put('/:id', equipmentValidation, equipmentController.updateEquipment)

// 删除设备
router.delete('/:id', equipmentController.deleteEquipment)

export default router