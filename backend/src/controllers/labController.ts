import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import * as labModel from '../models/labModel'
import { CreateLabData, UpdateLabData } from '../models/labModel'

export const createLab = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      })
    }

    const labData: CreateLabData = {
      code: req.body.code,
      name: req.body.name,
      building_id: req.body.building_id,
      building_name: req.body.building_name,
      room_number: req.body.room_number,
      room_capacity: req.body.room_capacity,
      lab_type: req.body.lab_type || 'general',
      description: req.body.description,
      equipment_count: req.body.equipment_count || 0,
      status: req.body.status || 'available'
    }

    // 检查实验室名称是否已存在
    const existingLab = await labModel.getLabByName(labData.name)
    if (existingLab) {
      return res.status(409).json({
        success: false,
        message: '实验室名称已存在'
      })
    }

    const labId = await labModel.createLab(labData)
    const newLab = await labModel.getLabById(labId)

    res.status(201).json({
      success: true,
      message: '实验室创建成功',
      data: newLab
    })
  } catch (error) {
    console.error('创建实验室失败:', error)
    res.status(500).json({
      success: false,
      message: '创建实验室失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const getAllLabs = async (req: Request, res: Response) => {
  try {
    const { building_id, lab_type, status } = req.query
    
    let labs
    if (building_id || lab_type || status) {
      labs = await labModel.getLabsByFilter({
        building_id: building_id ? parseInt(building_id as string) : undefined,
        lab_type: lab_type as string,
        status: status as string
      })
    } else {
      labs = await labModel.getAllLabs()
    }
    
    res.json({
      success: true,
      message: '实验室列表获取成功',
      data: labs,
      total: labs.length
    })
  } catch (error) {
    console.error('获取实验室列表失败:', error)
    res.status(500).json({
      success: false,
      message: '获取实验室列表失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const getLabById = async (req: Request, res: Response) => {
  try {
    const labId = parseInt(req.params.id)
    
    if (isNaN(labId)) {
      return res.status(400).json({
        success: false,
        message: '无效的实验室ID'
      })
    }

    const lab = await labModel.getLabById(labId)
    
    if (!lab) {
      return res.status(404).json({
        success: false,
        message: '实验室不存在'
      })
    }

    res.json({
      success: true,
      message: '实验室信息获取成功',
      data: lab
    })
  } catch (error) {
    console.error('获取实验室信息失败:', error)
    res.status(500).json({
      success: false,
      message: '获取实验室信息失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const updateLab = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      })
    }

    const labId = parseInt(req.params.id)
    
    if (isNaN(labId)) {
      return res.status(400).json({
        success: false,
        message: '无效的实验室ID'
      })
    }

    // 检查实验室是否存在
    const existingLab = await labModel.getLabById(labId)
    if (!existingLab) {
      return res.status(404).json({
        success: false,
        message: '实验室不存在'
      })
    }

    const updateData: UpdateLabData = {}
    
    if (req.body.name !== undefined) updateData.name = req.body.name
    if (req.body.building_id !== undefined) updateData.building_id = req.body.building_id
    if (req.body.building_name !== undefined) updateData.building_name = req.body.building_name
    if (req.body.room_number !== undefined) updateData.room_number = req.body.room_number
    if (req.body.room_capacity !== undefined) updateData.room_capacity = req.body.room_capacity
    if (req.body.lab_type !== undefined) updateData.lab_type = req.body.lab_type
    if (req.body.description !== undefined) updateData.description = req.body.description
    if (req.body.equipment_count !== undefined) updateData.equipment_count = req.body.equipment_count
    if (req.body.status !== undefined) updateData.status = req.body.status

    const updated = await labModel.updateLab(labId, updateData)
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: '实验室更新失败'
      })
    }

    const updatedLab = await labModel.getLabById(labId)

    res.json({
      success: true,
      message: '实验室更新成功',
      data: updatedLab
    })
  } catch (error) {
    console.error('更新实验室失败:', error)
    res.status(500).json({
      success: false,
      message: '更新实验室失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const deleteLab = async (req: Request, res: Response) => {
  try {
    const labId = parseInt(req.params.id)
    
    if (isNaN(labId)) {
      return res.status(400).json({
        success: false,
        message: '无效的实验室ID'
      })
    }

    // 检查实验室是否存在
    const existingLab = await labModel.getLabById(labId)
    if (!existingLab) {
      return res.status(404).json({
        success: false,
        message: '实验室不存在'
      })
    }

    const deleted = await labModel.deleteLab(labId)
    
    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: '实验室删除失败'
      })
    }

    res.json({
      success: true,
      message: '实验室删除成功'
    })
  } catch (error) {
    console.error('删除实验室失败:', error)
    res.status(500).json({
      success: false,
      message: '删除实验室失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const getLabEquipment = async (req: Request, res: Response) => {
  try {
    const labId = parseInt(req.params.id)
    
    if (isNaN(labId)) {
      return res.status(400).json({
        success: false,
        message: '无效的实验室ID'
      })
    }

    // 检查实验室是否存在
    const existingLab = await labModel.getLabById(labId)
    if (!existingLab) {
      return res.status(404).json({
        success: false,
        message: '实验室不存在'
      })
    }

    const equipment = await labModel.getLabEquipment(labId)
    
    res.json({
      success: true,
      message: '实验室设备列表获取成功',
      data: equipment,
      total: equipment.length
    })
  } catch (error) {
    console.error('获取实验室设备失败:', error)
    res.status(500).json({
      success: false,
      message: '获取实验室设备失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}