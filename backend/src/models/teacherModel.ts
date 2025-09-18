import { query } from '../config/database';
import { Teacher } from '../types';

/**
 * 根据教师工号查找教师
 */
export const findTeacherByTeacherId = async (teacher_id: string): Promise<Teacher | null> => {
  try {
    const results = await query('SELECT * FROM teachers WHERE teacher_id = ?', [teacher_id]);
    return results.length > 0 ? results[0] as Teacher : null;
  } catch (error) {
    console.error('查找教师错误:', error);
    throw error;
  }
};

/**
 * 根据ID查找教师
 */
export const findTeacherById = async (id: number): Promise<Teacher | null> => {
  try {
    const results = await query('SELECT * FROM teachers WHERE id = ?', [id]);
    return results.length > 0 ? results[0] as Teacher : null;
  } catch (error) {
    console.error('查找教师错误:', error);
    throw error;
  }
};

/**
 * 创建教师
 */
export const createTeacher = async (teacherData: {
  teacher_id: string;
  name: string;
  department?: string;
  title?: string;
}): Promise<number> => {
  try {
    const result = await query(
      'INSERT INTO teachers (teacher_id, name, department, title) VALUES (?, ?, ?, ?)',
      [teacherData.teacher_id, teacherData.name, teacherData.department || null, teacherData.title || null]
    );
    return result.insertId;
  } catch (error) {
    console.error('创建教师错误:', error);
    throw error;
  }
};

/**
 * 更新教师信息
 */
export const updateTeacher = async (id: number, teacherData: Partial<Teacher>): Promise<boolean> => {
  try {
    const fields = [];
    const values = [];
    
    if (teacherData.name) {
      fields.push('name = ?');
      values.push(teacherData.name);
    }
    
    if (teacherData.department !== undefined) {
      fields.push('department = ?');
      values.push(teacherData.department);
    }
    
    if (teacherData.title !== undefined) {
      fields.push('title = ?');
      values.push(teacherData.title);
    }
    
    if (fields.length === 0) {
      return false;
    }
    
    values.push(id);
    const sql = `UPDATE teachers SET ${fields.join(', ')} WHERE id = ?`;
    
    const result = await query(sql, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('更新教师错误:', error);
    throw error;
  }
};

/**
 * 删除教师
 */
export const deleteTeacher = async (id: number): Promise<boolean> => {
  try {
    const result = await query('DELETE FROM teachers WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('删除教师错误:', error);
    throw error;
  }
};

/**
 * 获取教师列表（分页）
 */
export const getTeacherList = async (page: number = 1, limit: number = 10, department?: string) => {
  try {
    const offset = (page - 1) * limit;
    let whereClause = '';
    let params: any[] = [];
    
    if (department) {
      whereClause = 'WHERE department LIKE ?';
      params.push(`%${department}%`);
    }
    
    // 获取总数
    const countResult = await query(`SELECT COUNT(*) as total FROM teachers ${whereClause}`, params);
    const total = countResult[0].total;
    
    // 获取分页数据
    const results = await query(
      `SELECT * FROM teachers ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    return {
      data: results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error('获取教师列表错误:', error);
    throw error;
  }
};

/**
 * 获取所有教师（用于下拉选择）
 */
export const getAllTeachers = async (): Promise<Teacher[]> => {
  try {
    const results = await query('SELECT id, teacher_id, name, department, title FROM teachers ORDER BY name');
    return results as Teacher[];
  } catch (error) {
    console.error('获取所有教师错误:', error);
    throw error;
  }
};