import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { formatResponse } from '../utils';

/**
 * 验证请求参数中间件
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(formatResponse(false, '请求参数验证失败', errors.array()));
  }
  next();
};

/**
 * 错误处理中间件
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('错误信息:', err);
  
  // 数据库错误
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json(formatResponse(false, '数据已存在，请检查重复项'));
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW' || err.code === 'ER_ROW_IS_REFERENCED') {
    return res.status(400).json(formatResponse(false, '数据关联错误'));
  }
  
  // JWT错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json(formatResponse(false, '无效的令牌'));
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json(formatResponse(false, '令牌已过期'));
  }
  
  // 默认错误
  res.status(500).json(formatResponse(false, '服务器内部错误'));
};