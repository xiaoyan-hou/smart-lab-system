import { query } from '../config/database'
import { OkPacket, RowDataPacket } from 'mysql2'

export interface Course {
  id: number
  code: string
  name: string
  credit: number
  total_hours: number
  department?: string
  type: 'theory' | 'lab' | 'mixed'
  description?: string
  created_at: Date
}

export interface CreateCourseData {
  code: string
  name: string
  credit: number
  total_hours: number
  department?: string
  type?: 'theory' | 'lab' | 'mixed'
  description?: string
}

export interface UpdateCourseData {
  code?: string
  name?: string
  credit?: number
  total_hours?: number
  department?: string
  type?: 'theory' | 'lab' | 'mixed'
  description?: string
}

export const createCourse = async (courseData: CreateCourseData): Promise<number> => {
  const { code, name, credit, total_hours, department, type = 'mixed', description } = courseData
  
  const result = await query(
    `INSERT INTO courses (code, name, credit, total_hours, department, type, description) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [code, name, credit, total_hours, department, type, description]
  ) as OkPacket
  
  return result.insertId
}

export const getAllCourses = async (): Promise<Course[]> => {
  const results = await query(
    'SELECT * FROM courses ORDER BY created_at DESC'
  ) as RowDataPacket[]
  
  return results as Course[]
}

export const getCourseById = async (id: number): Promise<Course | null> => {
  const results = await query(
    'SELECT * FROM courses WHERE id = ?',
    [id]
  ) as RowDataPacket[]
  
  return results.length > 0 ? (results[0] as Course) : null
}

export const getCourseByCode = async (code: string): Promise<Course | null> => {
  const results = await query(
    'SELECT * FROM courses WHERE code = ?',
    [code]
  ) as RowDataPacket[]
  
  return results.length > 0 ? (results[0] as Course) : null
}

export const updateCourse = async (id: number, courseData: UpdateCourseData): Promise<boolean> => {
  const fields = []
  const values = []
  
  for (const [key, value] of Object.entries(courseData)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`)
      values.push(value)
    }
  }
  
  if (fields.length === 0) {
    return false
  }
  
  values.push(id)
  
  const result = await query(
    `UPDATE courses SET ${fields.join(', ')} WHERE id = ?`,
    values
  ) as OkPacket
  
  return result.affectedRows > 0
}

export const deleteCourse = async (id: number): Promise<boolean> => {
  const result = await query(
    'DELETE FROM courses WHERE id = ?',
    [id]
  ) as OkPacket
  
  return result.affectedRows > 0
}

export const searchCourses = async (keyword: string): Promise<Course[]> => {
  const results = await query(
    `SELECT * FROM courses 
     WHERE code LIKE ? OR name LIKE ? OR department LIKE ?
     ORDER BY created_at DESC`,
    [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
  ) as RowDataPacket[]
  
  return results as Course[]
}