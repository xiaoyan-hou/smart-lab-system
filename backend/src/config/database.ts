import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '23012302',
  database: process.env.DB_NAME || 'smart_lab',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// 创建连接池
const pool = mysql.createPool(dbConfig);

// 数据库连接测试
export const testConnection = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✅ 数据库连接成功');
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
    return false;
  }
};

// 执行查询
export const query = async (sql: string, params?: any[]): Promise<any> => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('数据库查询错误:', error);
    throw error;
  }
};

// 获取连接
export const getConnection = async (): Promise<mysql.PoolConnection> => {
  return await pool.getConnection();
};

// 开始事务
export const beginTransaction = async (): Promise<mysql.PoolConnection> => {
  const connection = await getConnection();
  await connection.beginTransaction();
  return connection;
};

// 提交事务
export const commitTransaction = async (connection: mysql.PoolConnection): Promise<void> => {
  await connection.commit();
  connection.release();
};

// 回滚事务
export const rollbackTransaction = async (connection: mysql.PoolConnection): Promise<void> => {
  await connection.rollback();
  connection.release();
};

export default pool;