import { Request, Response, NextFunction } from 'express';
import { verifyToken, extractTokenFromHeader } from '../utils/auth';
import { formatResponse } from '../utils';
import { findUserById } from '../models/userModel';

/**
 * JWT认证中间件
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;
    const token = extractTokenFromHeader(authorization);

    if (!token) {
      return res.status(401).json(formatResponse(false, '未提供访问令牌'));
    }

    // 验证令牌
    const decoded = verifyToken(token);
    
    // 检查用户是否存在
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json(formatResponse(false, '用户不存在'));
    }

    // 将用户信息附加到请求对象
    (req as any).user = {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('认证错误:', error);
    return res.status(401).json(formatResponse(false, '无效的访问令牌'));
  }
};

/**
 * 管理员权限中间件
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user || user.role !== 'admin') {
    return res.status(403).json(formatResponse(false, '需要管理员权限'));
  }
  
  next();
};

/**
 * 教师权限中间件
 */
export const requireTeacher = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user || (user.role !== 'admin' && user.role !== 'teacher')) {
    return res.status(403).json(formatResponse(false, '需要教师权限'));
  }
  
  next();
};

/**
 * 学生权限中间件
 */
export const requireStudent = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user || (user.role !== 'admin' && user.role !== 'student')) {
    return res.status(403).json(formatResponse(false, '需要学生权限'));
  }
  
  next();
};

/**
 * 多角色权限中间件
 */
export const requireRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json(formatResponse(false, '权限不足'));
    }
    
    next();
  };
};