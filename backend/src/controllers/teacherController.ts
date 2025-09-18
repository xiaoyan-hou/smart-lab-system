import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { 
  findTeacherByTeacherId, 
  findTeacherById, 
  createTeacher as createTeacherModel, 
  updateTeacher as updateTeacherModel, 
  deleteTeacher as deleteTeacherModel, 
  getTeacherList, 
  getAllTeachers 
} from '../models/teacherModel';
import { formatResponse } from '../utils';
import { Teacher } from '../types';

/**
 * 获取教师列表
 */
export const getTeachers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const department = req.query.department as string;

    const result = await getTeacherList(page, limit, department);
    
    res.json(formatResponse(true, '获取教师列表成功', result));
  } catch (error) {
    console.error('获取教师列表错误:', error);
    res.status(500).json(formatResponse(false, '服务器内部错误'));
  }
};

/**
 * 获取所有教师（下拉选择）
 */
export const getAllTeachersController = async (req: Request, res: Response) => {
  try {
    const teachers = await getAllTeachers();
    res.json(formatResponse(true, '获取所有教师成功', teachers));
  } catch (error) {
    console.error('获取所有教师错误:', error);
    res.status(500).json(formatResponse(false, '服务器内部错误'));
  }
};

/**
 * 获取教师详情
 */
export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json(formatResponse(false, '无效的ID参数'));
    }

    const teacher = await findTeacherById(id);
    
    if (!teacher) {
      return res.status(404).json(formatResponse(false, '教师不存在'));
    }

    res.json(formatResponse(true, '获取教师详情成功', teacher));
  } catch (error) {
    console.error('获取教师详情错误:', error);
    res.status(500).json(formatResponse(false, '服务器内部错误'));
  }
};

/**
 * 创建教师
 */
export const createTeacher = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, '请求参数错误', errors.array()));
    }

    const { teacher_id, name, department, title } = req.body;

    // 检查教师工号是否已存在
    const existingTeacher = await findTeacherByTeacherId(teacher_id);
    if (existingTeacher) {
      return res.status(400).json(formatResponse(false, '教师工号已存在'));
    }

    // 创建教师
    const teacherId = await createTeacherModel({
      teacher_id,
      name,
      department,
      title
    });

    res.json(formatResponse(true, '教师创建成功', { id: teacherId }));
  } catch (error) {
    console.error('创建教师错误:', error);
    res.status(500).json(formatResponse(false, '服务器内部错误'));
  }
};

/**
 * 更新教师信息
 */
export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, '请求参数错误', errors.array()));
    }

    const id = parseInt(req.params.id);
    const { name, department, title } = req.body;

    if (isNaN(id)) {
      return res.status(400).json(formatResponse(false, '无效的ID参数'));
    }

    // 检查教师是否存在
    const existingTeacher = await findTeacherById(id);
    if (!existingTeacher) {
      return res.status(404).json(formatResponse(false, '教师不存在'));
    }

    // 更新教师信息
    const success = await updateTeacherModel(id, {
      name,
      department,
      title
    });

    if (success) {
      res.json(formatResponse(true, '教师信息更新成功'));
    } else {
      res.status(400).json(formatResponse(false, '教师信息更新失败'));
    }
  } catch (error) {
    console.error('更新教师错误:', error);
    res.status(500).json(formatResponse(false, '服务器内部错误'));
  }
};

/**
 * 删除教师
 */
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json(formatResponse(false, '无效的ID参数'));
    }

    // 检查教师是否存在
    const existingTeacher = await findTeacherById(id);
    if (!existingTeacher) {
      return res.status(404).json(formatResponse(false, '教师不存在'));
    }

    // 删除教师
    const success = await deleteTeacherModel(id);

    if (success) {
      res.json(formatResponse(true, '教师删除成功'));
    } else {
      res.status(400).json(formatResponse(false, '教师删除失败'));
    }
  } catch (error) {
    console.error('删除教师错误:', error);
    res.status(500).json(formatResponse(false, '服务器内部错误'));
  }
};