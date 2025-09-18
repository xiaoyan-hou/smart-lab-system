import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import * as courseOfferingModel from '../models/courseOfferingModel'
import { CreateCourseOfferingData, UpdateCourseOfferingData } from '../models/courseOfferingModel'

export const createCourseOffering = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      })
    }

    const offeringData: CreateCourseOfferingData = {
      course_id: req.body.course_id,
      teacher_id: req.body.teacher_id,
      semester: req.body.semester,
      academic_year: req.body.academic_year,
      max_students: req.body.max_students,
      lab_hours: req.body.lab_hours,
      theory_hours: req.body.theory_hours,
      description: req.body.description,
      status: req.body.status || 'active'
    }

    // 检查课程是否存在
    const courseExists = await courseOfferingModel.checkCourseExists(offeringData.course_id)
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: '课程不存在'
      })
    }

    // 检查教师是否存在
    const teacherExists = await courseOfferingModel.checkTeacherExists(offeringData.teacher_id)
    if (!teacherExists) {
      return res.status(404).json({
        success: false,
        message: '教师不存在'
      })
    }

    // 检查同一课程在同一学期是否已开设
    const existingOffering = await courseOfferingModel.getCourseOfferingByCourseAndSemester(
      offeringData.course_id,
      offeringData.semester,
      offeringData.academic_year
    )
    if (existingOffering) {
      return res.status(409).json({
        success: false,
        message: '该课程在当前学期已开设'
      })
    }

    const offeringId = await courseOfferingModel.createCourseOffering(offeringData)
    const newOffering = await courseOfferingModel.getCourseOfferingById(offeringId)

    res.status(201).json({
      success: true,
      message: '开课信息创建成功',
      data: newOffering
    })
  } catch (error) {
    console.error('创建开课信息失败:', error)
    res.status(500).json({
      success: false,
      message: '创建开课信息失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const getAllCourseOfferings = async (req: Request, res: Response) => {
  try {
    const { course_id, teacher_id, semester, academic_year, status } = req.query
    
    let offerings
    if (course_id || teacher_id || semester || academic_year || status) {
      offerings = await courseOfferingModel.getCourseOfferingsByFilter({
        course_id: course_id ? parseInt(course_id as string) : undefined,
        teacher_id: teacher_id ? parseInt(teacher_id as string) : undefined,
        semester: semester as string,
        academic_year: academic_year as string,
        status: status as string
      })
    } else {
      offerings = await courseOfferingModel.getAllCourseOfferings()
    }
    
    res.json({
      success: true,
      message: '开课信息列表获取成功',
      data: offerings,
      total: offerings.length
    })
  } catch (error) {
    console.error('获取开课信息列表失败:', error)
    res.status(500).json({
      success: false,
      message: '获取开课信息列表失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const getCourseOfferingById = async (req: Request, res: Response) => {
  try {
    const offeringId = parseInt(req.params.id)
    
    if (isNaN(offeringId)) {
      return res.status(400).json({
        success: false,
        message: '无效的开课信息ID'
      })
    }

    const offering = await courseOfferingModel.getCourseOfferingById(offeringId)
    
    if (!offering) {
      return res.status(404).json({
        success: false,
        message: '开课信息不存在'
      })
    }

    res.json({
      success: true,
      message: '开课信息获取成功',
      data: offering
    })
  } catch (error) {
    console.error('获取开课信息失败:', error)
    res.status(500).json({
      success: false,
      message: '获取开课信息失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const updateCourseOffering = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      })
    }

    const offeringId = parseInt(req.params.id)
    
    if (isNaN(offeringId)) {
      return res.status(400).json({
        success: false,
        message: '无效的开课信息ID'
      })
    }

    // 检查开课信息是否存在
    const existingOffering = await courseOfferingModel.getCourseOfferingById(offeringId)
    if (!existingOffering) {
      return res.status(404).json({
        success: false,
        message: '开课信息不存在'
      })
    }

    const updateData: UpdateCourseOfferingData = {}
    
    if (req.body.course_id !== undefined) updateData.course_id = req.body.course_id
    if (req.body.teacher_id !== undefined) updateData.teacher_id = req.body.teacher_id
    if (req.body.semester !== undefined) updateData.semester = req.body.semester
    if (req.body.academic_year !== undefined) updateData.academic_year = req.body.academic_year
    if (req.body.max_students !== undefined) updateData.max_students = req.body.max_students
    if (req.body.lab_hours !== undefined) updateData.lab_hours = req.body.lab_hours
    if (req.body.theory_hours !== undefined) updateData.theory_hours = req.body.theory_hours
    if (req.body.description !== undefined) updateData.description = req.body.description
    if (req.body.status !== undefined) updateData.status = req.body.status

    // 如果更新了课程、学期或学年，需要检查重复
    if (updateData.course_id || updateData.semester || updateData.academic_year) {
      const courseId = updateData.course_id || existingOffering.course_id
      const semester = updateData.semester || existingOffering.semester
      const academicYear = updateData.academic_year || existingOffering.academic_year

      const duplicateOffering = await courseOfferingModel.getCourseOfferingByCourseAndSemester(
        courseId,
        semester,
        academicYear
      )
      
      if (duplicateOffering && duplicateOffering.id !== offeringId) {
        return res.status(409).json({
          success: false,
          message: '该课程在当前学期已开设'
        })
      }
    }

    // 如果更新了教师，需要检查教师是否存在
    if (updateData.teacher_id) {
      const teacherExists = await courseOfferingModel.checkTeacherExists(updateData.teacher_id)
      if (!teacherExists) {
        return res.status(404).json({
          success: false,
          message: '教师不存在'
        })
      }
    }

    const updated = await courseOfferingModel.updateCourseOffering(offeringId, updateData)
    
    if (!updated) {
      return res.status(400).json({
        success: false,
        message: '开课信息更新失败'
      })
    }

    const updatedOffering = await courseOfferingModel.getCourseOfferingById(offeringId)

    res.json({
      success: true,
      message: '开课信息更新成功',
      data: updatedOffering
    })
  } catch (error) {
    console.error('更新开课信息失败:', error)
    res.status(500).json({
      success: false,
      message: '更新开课信息失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const deleteCourseOffering = async (req: Request, res: Response) => {
  try {
    const offeringId = parseInt(req.params.id)
    
    if (isNaN(offeringId)) {
      return res.status(400).json({
        success: false,
        message: '无效的开课信息ID'
      })
    }

    // 检查开课信息是否存在
    const existingOffering = await courseOfferingModel.getCourseOfferingById(offeringId)
    if (!existingOffering) {
      return res.status(404).json({
        success: false,
        message: '开课信息不存在'
      })
    }

    const deleted = await courseOfferingModel.deleteCourseOffering(offeringId)
    
    if (!deleted) {
      return res.status(400).json({
        success: false,
        message: '开课信息删除失败'
      })
    }

    res.json({
      success: true,
      message: '开课信息删除成功'
    })
  } catch (error) {
    console.error('删除开课信息失败:', error)
    res.status(500).json({
      success: false,
      message: '删除开课信息失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const getCourseOfferingClasses = async (req: Request, res: Response) => {
  try {
    const offeringId = parseInt(req.params.id)
    
    if (isNaN(offeringId)) {
      return res.status(400).json({
        success: false,
        message: '无效的开课信息ID'
      })
    }

    // 检查开课信息是否存在
    const existingOffering = await courseOfferingModel.getCourseOfferingById(offeringId)
    if (!existingOffering) {
      return res.status(404).json({
        success: false,
        message: '开课信息不存在'
      })
    }

    const classes = await courseOfferingModel.getCourseOfferingClasses(offeringId)
    
    res.json({
      success: true,
      message: '开课班级列表获取成功',
      data: classes,
      total: classes.length
    })
  } catch (error) {
    console.error('获取开课班级失败:', error)
    res.status(500).json({
      success: false,
        message: '获取开课班级失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const addClassToCourseOffering = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入数据验证失败',
        errors: errors.array()
      })
    }

    const offeringId = parseInt(req.params.id)
    const classId = req.body.class_id
    
    if (isNaN(offeringId) || !classId) {
      return res.status(400).json({
        success: false,
        message: '无效的参数'
      })
    }

    // 检查开课信息是否存在
    const existingOffering = await courseOfferingModel.getCourseOfferingById(offeringId)
    if (!existingOffering) {
      return res.status(404).json({
        success: false,
        message: '开课信息不存在'
      })
    }

    // 检查班级是否存在
    const classExists = await courseOfferingModel.checkClassExists(classId)
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: '班级不存在'
      })
    }

    // 检查是否已经添加过
    const existingRelation = await courseOfferingModel.checkClassOfferingRelation(offeringId, classId)
    if (existingRelation) {
      return res.status(409).json({
        success: false,
        message: '该班级已添加到此开课信息'
      })
    }

    const relationId = await courseOfferingModel.addClassToCourseOffering(offeringId, classId)
    
    res.status(201).json({
      success: true,
      message: '班级添加成功',
      data: { id: relationId }
    })
  } catch (error) {
    console.error('添加班级到开课信息失败:', error)
    res.status(500).json({
      success: false,
      message: '添加班级到开课信息失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}

export const removeClassFromCourseOffering = async (req: Request, res: Response) => {
  try {
    const offeringId = parseInt(req.params.id)
    const classId = parseInt(req.params.classId)
    
    if (isNaN(offeringId) || isNaN(classId)) {
      return res.status(400).json({
        success: false,
        message: '无效的参数'
      })
    }

    // 检查开课信息是否存在
    const existingOffering = await courseOfferingModel.getCourseOfferingById(offeringId)
    if (!existingOffering) {
      return res.status(404).json({
        success: false,
        message: '开课信息不存在'
      })
    }

    const deleted = await courseOfferingModel.removeClassFromCourseOffering(offeringId, classId)
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: '该班级未添加到此开课信息'
      })
    }

    res.json({
      success: true,
      message: '班级移除成功'
    })
  } catch (error) {
    console.error('从开课信息移除班级失败:', error)
    res.status(500).json({
      success: false,
      message: '从开课信息移除班级失败',
      error: error instanceof Error ? error.message : '未知错误'
    })
  }
}