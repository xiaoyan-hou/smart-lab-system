import { query } from '../config/database';
import { User } from '../types';

/**
 * 根据用户名查找用户
 */
export const findUserByUsername = async (username: string): Promise<User | null> => {
  try {
    const results = await query('SELECT * FROM users WHERE username = ?', [username]);
    return results.length > 0 ? results[0] as User : null;
  } catch (error) {
    console.error('查找用户错误:', error);
    throw error;
  }
};

/**
 * 根据ID查找用户
 */
export const findUserById = async (id: number): Promise<User | null> => {
  try {
    const results = await query('SELECT * FROM users WHERE id = ?', [id]);
    return results.length > 0 ? results[0] as User : null;
  } catch (error) {
    console.error('查找用户错误:', error);
    throw error;
  }
};

/**
 * 创建用户
 */
export const createUser = async (userData: {
  username: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
}): Promise<number> => {
  try {
    const result = await query(
      'INSERT INTO users (username, password_hash, name, role) VALUES (?, ?, ?, ?)',
      [userData.username, userData.password_hash, userData.name, userData.role]
    );
    return result.insertId;
  } catch (error) {
    console.error('创建用户错误:', error);
    throw error;
  }
};

/**
 * 更新用户信息
 */
export const updateUser = async (id: number, userData: Partial<User>): Promise<boolean> => {
  try {
    const fields = [];
    const values = [];
    
    if (userData.name) {
      fields.push('name = ?');
      values.push(userData.name);
    }
    
    if (userData.password_hash) {
      fields.push('password_hash = ?');
      values.push(userData.password_hash);
    }
    
    if (userData.role) {
      fields.push('role = ?');
      values.push(userData.role);
    }
    
    if (fields.length === 0) {
      return false;
    }
    
    values.push(id);
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    const result = await query(sql, values);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('更新用户错误:', error);
    throw error;
  }
};

/**
 * 删除用户
 */
export const deleteUser = async (id: number): Promise<boolean> => {
  try {
    const result = await query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('删除用户错误:', error);
    throw error;
  }
};

/**
 * 获取用户列表（分页）
 */
export const getUserList = async (page: number = 1, limit: number = 10, role?: string) => {
  try {
    const offset = (page - 1) * limit;
    let whereClause = '';
    let params: any[] = [];
    
    if (role) {
      whereClause = 'WHERE role = ?';
      params.push(role);
    }
    
    // 获取总数
    const countResult = await query(`SELECT COUNT(*) as total FROM users ${whereClause}`, params);
    const total = countResult[0].total;
    
    // 获取分页数据
    const results = await query(
      `SELECT id, username, name, role, created_at, updated_at FROM users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
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
    console.error('获取用户列表错误:', error);
    throw error;
  }
};