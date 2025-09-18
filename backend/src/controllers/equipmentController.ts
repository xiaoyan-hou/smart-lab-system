import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import * as equipmentModel from '../models/equipmentModel'
import { CreateEquipmentData, UpdateEquipmentData } from '../models/equipmentModel'

export const createEquipment = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      })
    }

    const equipmentData: CreateEquipmentData = {
      name: req.body.name,
      model: req.body.model,
      serial_number: req.body.serial_number,
      lab_id: req.body.lab_id,
      category: req.body.category,
      manufacturer: req.body.manufacturer,
      purchase_date: req.body.purchase_date,
      purchase_price: req.body.purchase_price,
      status: req.body.status || 'active',
      description: req.body.description,
      specifications: req.body.specifications
    }

    // 检查设备序列号是否已存在（如果提供了序列号）
    if (equipmentData.serial_number) {
      const existingEquipment = await equipmentModel.getEquipmentBySerialNumber(equipmentData.serial_number)
      if (existingEquipment) {
        return res.status(409).json({
          success: false,
          message: '设备序列号已存在'
        })
      }
    }

    const equipmentId = await equipmentModel.createEquipment(equipmentData)
    const newEquipment = await equipmentModel.getEquipmentById(equipmentId)

    res.status(201).json({
      success: true,
      message: '设备创建成功',
      data: newEquipment
    })
  } catch (error) {
    console.error('创建设备失败:', error)
    res.status(500).json({
      success: false,
      message: '创建设备失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const getAllEquipments = async (req: Request, res: Response) => {
  try {
    const { lab_id, category, status } = req.query
    
    let equipments
    if (lab_id || category || status) {
      equipments = await equipmentModel.getEquipmentsByFilter({
        lab_id: lab_id ? parseInt(lab_id as string) : undefined,
        category: category as string,
        status: status as string
      })
    } else {
      equipments = await equipmentModel.getAllEquipments()
    }
    
    res.json({
      success: true,
      message: '设备列表获取成功',
      data: equipments,
      total: equipments.length
    })
  } catch (error) {
    console.error('获取设备列表失败:', error)
    res.status(500).json({
      success: false,
      message: '获取设备列表失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const getEquipmentById = async (req: Request, res: Response) => {
  try {
    const equipmentId = parseInt(req.params.id)
    
    if (isNaN(equipmentId)) {
      return res.status(400).json({
        success: false,
        message: '无效的设备ID'
      })
    }

    const equipment = await equipmentModel.getEquipmentById(equipmentId)
    
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: '设备不存在'
      })
    }

    res.json({
      success: true,
      message: '设备信息获取成功',
      data: equipment
    })
  } catch (error) {
    console.error('获取设备信息失败:', error)
    res.status(500).json({
      success: false,
      message: '获取设备信息失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const updateEquipment = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      })
    }

    const equipmentId = parseInt(req.params.id)
    
    if (isNaN(equipmentId)) {
      return res.status(400).json({
        success: false,
        message: '无效的设备ID'
      })
    }

    // 检查设备是否存在
    const existingEquipment = await equipmentModel.getEquipmentById(equipmentId)
    if (!existingEquipment) {
      return res.status(404).json({
        success: false,
        message: '设备不存在'
      })
    }

    const updateData: UpdateEquipmentData = {}
    
    if (req.body.name !== undefined) updateData.name = req.body.name
    if (req.body.model !== undefined) updateData.model = req.body.model
    if (req.body.serial_number !== undefined) updateData.serial_number = req.body.serial_number
    if (req.body.lab_id !== undefined) updateData.lab_id = req.body.lab_id
    if (req.body.category !== undefined) updateData.category = req.body.category
    if (req.body.manufacturer !== undefined) updateData.manufacturer = req.body.manufacturer
    if (req.body.purchase_date !== undefined) updateData.purchase_date = req.body.purchase_date
    if (req.body.purchase_price !== undefined) updateData.purchase_price = req.body.purchase_price
    if (req.body.status !== undefined) updateData.status = req.body.status
    if (req.body.description !== undefined) updateData.description = req.body.description
    if (req.body.specifications !== undefined) updateData.specifications = req.body.specifications

    const updated = await equipmentModel.updateEquipment(equipmentId, updateData)
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: '设备更新失败'
      })
    }

    const updatedEquipment = await equipmentModel.getEquipmentById(equipmentId)

    res.json({
      success: true,
      message: '设备更新成功',
      data: updatedEquipment
    })
  } catch (error) {
    console.error('更新设备失败:', error)
    res.status(500).json({
      success: false,
      message: '更新设备失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const deleteEquipment = async (req: Request, res: Response) => {
  try {
    const equipmentId = parseInt(req.params.id)
    
    if (isNaN(equipmentId)) {
      return res.status(400).json({
        success: false,
        message: '无效的设备ID'
      })
    }

    // 检查设备是否存在
    const existingEquipment = await equipmentModel.getEquipmentById(equipmentId)
    if (!existingEquipment) {
      return res.status(404).json({
        success: false,
        message: '设备不存在'
      })
    }

    const deleted = await equipmentModel.deleteEquipment(equipmentId)
    
    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: '设备删除失败'
      })
    }

    res.json({
      success: true,
      message: '设备删除成功'
    })
  } catch (error) {
    console.error('删除设备失败:', error)
    res.status(500).json({
      success: false,
      message: '删除设备失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const getEquipmentStats = async (req: Request, res: Response) => {
  try {
    const stats = await equipmentModel.getEquipmentStats()
    
    res.json({
      success: true,
      message: '设备统计信息获取成功',
      data: stats
    })
  } catch (error) {
    console.error('获取设备统计失败:', error)
    res.status(500).json({
      success: false,
      message: '获取设备统计失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}