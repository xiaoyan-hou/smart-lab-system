import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import * as courseModel from '../models/courseModel'
import { CreateCourseData, UpdateCourseData } from '../models/courseModel'

export const createCourse = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      })
    }

    const courseData: CreateCourseData = {
      code: req.body.code,
      name: req.body.name,
      credit: req.body.credit,
      total_hours: req.body.total_hours,
      department: req.body.department,
      type: req.body.type || 'mixed',
      description: req.body.description
    }

    // 检查课程代码是否已存在
    const existingCourse = await courseModel.getCourseByCode(courseData.code)
    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: '课程代码已存在'
      })
    }

    const courseId = await courseModel.createCourse(courseData)
    const newCourse = await courseModel.getCourseById(courseId)

    res.status(201).json({
      success: true,
      message: '课程创建成功',
      data: newCourse
    })
  } catch (error) {
    console.error('创建课程失败:', error)
    res.status(500).json({
      success: false,
      message: '创建课程失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await courseModel.getAllCourses()
    
    res.json({
      success: true,
      message: '课程列表获取成功',
      data: courses,
      total: courses.length
    })
  } catch (error) {
    console.error('获取课程列表失败:', error)
    res.status(500).json({
      success: false,
      message: '获取课程列表失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id)
    
    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: '无效的课程ID'
      })
    }

    const course = await courseModel.getCourseById(courseId)
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: '课程不存在'
      })
    }

    res.json({
      success: true,
      message: '课程信息获取成功',
      data: course
    })
  } catch (error) {
    console.error('获取课程信息失败:', error)
    res.status(500).json({
      success: false,
      message: '获取课程信息失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      })
    }

    const courseId = parseInt(req.params.id)
    
    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: '无效的课程ID'
      })
    }

    // 检查课程是否存在
    const existingCourse = await courseModel.getCourseById(courseId)
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: '课程不存在'
      })
    }

    const updateData: UpdateCourseData = {}
    
    if (req.body.code !== undefined) updateData.code = req.body.code
    if (req.body.name !== undefined) updateData.name = req.body.name
    if (req.body.credit !== undefined) updateData.credit = req.body.credit
    if (req.body.total_hours !== undefined) updateData.total_hours = req.body.total_hours
    if (req.body.department !== undefined) updateData.department = req.body.department
    if (req.body.type !== undefined) updateData.type = req.body.type
    if (req.body.description !== undefined) updateData.description = req.body.description

    const updated = await courseModel.updateCourse(courseId, updateData)
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: '课程更新失败'
      })
    }

    const updatedCourse = await courseModel.getCourseById(courseId)

    res.json({
      success: true,
      message: '课程更新成功',
      data: updatedCourse
    })
  } catch (error) {
    console.error('更新课程失败:', error)
    res.status(500).json({
      success: false,
      message: '更新课程失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id)
    
    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: '无效的课程ID'
      })
    }

    // 检查课程是否存在
    const existingCourse = await courseModel.getCourseById(courseId)
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: '课程不存在'
      })
    }

    const deleted = await courseModel.deleteCourse(courseId)
    
    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: '课程删除失败'
      })
    }

    res.json({
      success: true,
      message: '课程删除成功'
    })
  } catch (error) {
    console.error('删除课程失败:', error)
    res.status(500).json({
      success: false,
      message: '删除课程失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const searchCourses = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query
    
    if (!keyword || typeof keyword !== 'string') {
      return res.status(400).json({
        success: false,
        message: '搜索关键词不能为空'
      })
    }

    const courses = await courseModel.searchCourses(keyword)
    
    res.json({
      success: true,
      message: '课程搜索成功',
      data: courses,
      total: courses.length
    })
  } catch (error) {
    console.error('搜索课程失败:', error)
    res.status(500).json({
      success: false,
      message: '搜索课程失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}