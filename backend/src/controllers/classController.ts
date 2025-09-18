import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import * as classModel from '../models/classModel'
import { CreateClassData, UpdateClassData } from '../models/classModel'

export const createClass = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      })
    }

    const classData: CreateClassData = {
      name: req.body.name,
      department: req.body.department,
      major: req.body.major,
      grade: req.body.grade,
      class_number: req.body.class_number,
      student_count: req.body.student_count,
      head_teacher: req.body.head_teacher,
      description: req.body.description,
      status: req.body.status || 'active'
    }

    // 检查班级是否已存在（同专业同年级的班级号不能重复）
    const existingClass = await classModel.getClassByUniqueKey(
      classData.major,
      classData.grade,
      classData.class_number
    )
    if (existingClass) {
      return res.status(409).json({
        success: false,
        message: '该班级已存在'
      })
    }

    const classId = await classModel.createClass(classData)
    const newClass = await classModel.getClassById(classId)

    res.status(201).json({
      success: true,
      message: '班级创建成功',
      data: newClass
    })
  } catch (error) {
    console.error('创建班级失败:', error)
    res.status(500).json({
      success: false,
      message: '创建班级失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const getAllClasses = async (req: Request, res: Response) => {
  try {
    const { department, major, grade, status } = req.query
    
    let classes
    if (department || major || grade || status) {
      classes = await classModel.getClassesByFilter({
        department: department as string,
        major: major as string,
        grade: grade as string,
        status: status as string
      })
    } else {
      classes = await classModel.getAllClasses()
    }
    
    res.json({
      success: true,
      message: '班级列表获取成功',
      data: classes,
      total: classes.length
    })
  } catch (error) {
    console.error('获取班级列表失败:', error)
    res.status(500).json({
      success: false,
      message: '获取班级列表失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const getClassById = async (req: Request, res: Response) => {
  try {
    const classId = parseInt(req.params.id)
    
    if (isNaN(classId)) {
      return res.status(400).json({
        success: false,
        message: '无效的班级ID'
      })
    }

    const classData = await classModel.getClassById(classId)
    
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: '班级不存在'
      })
    }

    res.json({
      success: true,
      message: '班级信息获取成功',
      data: classData
    })
  } catch (error) {
    console.error('获取班级信息失败:', error)
    res.status(500).json({
      success: false,
      message: '获取班级信息失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const updateClass = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      })
    }

    const classId = parseInt(req.params.id)
    
    if (isNaN(classId)) {
      return res.status(400).json({
        success: false,
        message: '无效的班级ID'
      })
    }

    // 检查班级是否存在
    const existingClass = await classModel.getClassById(classId)
    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: '班级不存在'
      })
    }

    const updateData: UpdateClassData = {}
    
    if (req.body.name !== undefined) updateData.name = req.body.name
    if (req.body.department !== undefined) updateData.department = req.body.department
    if (req.body.major !== undefined) updateData.major = req.body.major
    if (req.body.grade !== undefined) updateData.grade = req.body.grade
    if (req.body.class_number !== undefined) updateData.class_number = req.body.class_number
    if (req.body.student_count !== undefined) updateData.student_count = req.body.student_count
    if (req.body.head_teacher !== undefined) updateData.head_teacher = req.body.head_teacher
    if (req.body.description !== undefined) updateData.description = req.body.description
    if (req.body.status !== undefined) updateData.status = req.body.status

    const updated = await classModel.updateClass(classId, updateData)
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: '班级更新失败'
      })
    }

    const updatedClass = await classModel.getClassById(classId)

    res.json({
      success: true,
      message: '班级更新成功',
      data: updatedClass
    })
  } catch (error) {
    console.error('更新班级失败:', error)
    res.status(500).json({
      success: false,
      message: '更新班级失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const deleteClass = async (req: Request, res: Response) => {
  try {
    const classId = parseInt(req.params.id)
    
    if (isNaN(classId)) {
      return res.status(400).json({
        success: false,
        message: '无效的班级ID'
      })
    }

    // 检查班级是否存在
    const existingClass = await classModel.getClassById(classId)
    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: '班级不存在'
      })
    }

    const deleted = await classModel.deleteClass(classId)
    
    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: '班级删除失败'
      })
    }

    res.json({
      success: true,
      message: '班级删除成功'
    })
  } catch (error) {
    console.error('删除班级失败:', error)
    res.status(500).json({
      success: false,
      message: '删除班级失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const getClassStats = async (req: Request, res: Response) => {
  try {
    const stats = await classModel.getClassStats()
    
    res.json({
      success: true,
      message: '班级统计信息获取成功',
      data: stats
    })
  } catch (error) {
    console.error('获取班级统计失败:', error)
    res.status(500).json({
      success: false,
      message: '获取班级统计失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}