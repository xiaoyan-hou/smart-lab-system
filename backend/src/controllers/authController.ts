import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { findUserByUsername, createUser, getUserList } from '../models/userModel';
import { hashPassword, verifyPassword, formatResponse } from '../utils';
import { generateToken } from '../utils/auth';
import { LoginRequest, LoginResponse } from '../types';

/**
 * 用户登录
 */
export const login = async (req: Request, res: Response) => {
  try {
    // 验证请求参数
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, '请求参数错误', errors.array()));
    }

    const { username, password }: LoginRequest = req.body;

    // 查找用户
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(401).json(formatResponse(false, '用户名或密码错误'));
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json(formatResponse(false, '用户名或密码错误'));
    }

    // 生成JWT令牌
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    // 返回用户信息（不包含密码）
    const { password_hash, ...userWithoutPassword } = user;

    const response: LoginResponse = {
      success: true,
      message: '登录成功',
      data: {
        user: userWithoutPassword,
        token
      }
    };

    res.json(response);
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json(formatResponse(false, '服务器内部错误'));
  }
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // 用户信息已通过auth中间件附加到请求对象
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json(formatResponse(false, '用户未登录'));
    }

    res.json(formatResponse(true, '获取用户信息成功', user));
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json(formatResponse(false, '服务器内部错误'));
  }
};

/**
 * 获取用户列表
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string;

    const result = await getUserList(page, limit, role);
    
    res.json(formatResponse(true, '获取用户列表成功', result));
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json(formatResponse(false, '服务器内部错误'));
  }
};

/**
 * 创建用户（管理员功能）
 */
export const createUserController = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, '请求参数错误', errors.array()));
    }

    const { username, password, name, role } = req.body;

    // 检查用户名是否已存在
    const existingUser = await findUserByUsername(username);
    if (existingUser) {
      return res.status(400).json(formatResponse(false, '用户名已存在'));
    }

    // 加密密码
    const password_hash = await hashPassword(password);

    // 创建用户
    const userId = await createUser({
      username,
      password_hash,
      name,
      role
    });

    res.json(formatResponse(true, '用户创建成功', { id: userId }));
  } catch (error) {
    console.error('创建用户错误:', error);
    res.status(500).json(formatResponse(false, '服务器内部错误'));
  }
};