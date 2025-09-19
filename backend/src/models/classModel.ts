import { query } from '../config/database'
import { OkPacket, RowDataPacket } from 'mysql2'

export interface Class {
  id: number
  class_id: string
  name: string
  major?: string
  department?: string
  student_count?: number
  year?: number
  created_at: Date
}

export interface CreateClassData {
  class_id: string
  name: string
  major?: string
  department?: string
  student_count?: number
  year?: number,
  grade?: string,
}

export interface UpdateClassData {
  class_id?: string
  name?: string
  major?: string
  department?: string
  student_count?: number
  year?: number
  class_number?: string
  head_teacher?: string
  description?: string
  status?: string,
  grade?: string,
}

export const createClass = async (classData: CreateClassData): Promise<number> => {
  const { class_id, name, major, department, student_count, year } = classData
  
  const result = await query(
    `INSERT INTO classes (class_id, name, major, department, student_count, year) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [class_id, name, major, department, student_count, year]
  ) as OkPacket
  
  return result.insertId
}

export const getAllClasses = async (): Promise<Class[]> => {
  const results = await query(
    'SELECT * FROM classes ORDER BY created_at DESC'
  ) as RowDataPacket[]
  
  return results as Class[]
}

export const getClassById = async (id: number): Promise<Class | null> => {
  const results = await query(
    'SELECT * FROM classes WHERE id = ?',
    [id]
  ) as RowDataPacket[]
  
  return results.length > 0 ? (results[0] as Class) : null
}

export const getClassByClassId = async (class_id: string): Promise<Class | null> => {
  const results = await query(
    'SELECT * FROM classes WHERE class_id = ?',
    [class_id]
  ) as RowDataPacket[]
  
  return results.length > 0 ? (results[0] as Class) : null
}

export const getClassesByDepartment = async (department: string): Promise<Class[]> => {
  const results = await query(
    'SELECT * FROM classes WHERE department = ? ORDER BY class_id',
    [department]
  ) as RowDataPacket[]
  
  return results as Class[]
}

export const getClassesByYear = async (year: number): Promise<Class[]> => {
  const results = await query(
    'SELECT * FROM classes WHERE year = ? ORDER BY class_id',
    [year]
  ) as RowDataPacket[]
  
  return results as Class[]
}

export const updateClass = async (id: number, classData: UpdateClassData): Promise<boolean> => {
  const fields = []
  const values = []
  
  for (const [key, value] of Object.entries(classData)) {
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
    `UPDATE classes SET ${fields.join(', ')} WHERE id = ?`,
    values
  ) as OkPacket
  
  return result.affectedRows > 0
}

// export const deleteClass = async (id: number): Promise<boolean> => {
//   const result = await query<>(
//     'DELETE FROM classes WHERE id = ?',
//     [id]
//   )
  
//   return result.affectedRows > 0
// }

// export const searchClasses = async (keyword: string): Promise<Class[]> => {
//   const results = await query<RowDataPacket[]>(
//     `SELECT * FROM classes 
//      WHERE class_id LIKE ? OR name LIKE ? OR major LIKE ? OR department LIKE ?
//      ORDER BY created_at DESC`,
//     [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
//   )
  
//   return results as Class[]
// }

// export const getClassStats = async (): Promise<{
//   totalClasses: number
//   totalStudents: number
//   departmentStats: Array<{department: string, count: number, totalStudents: number}>
// }> => {
//   const [totalResult] = await query<RowDataPacket[]>(
//     'SELECT COUNT(*) as total, COALESCE(SUM(student_count), 0) as totalStudents FROM classes'
//   )
  
//   const deptStats = await query<RowDataPacket[]>(
//     `SELECT 
//        department, 
//        COUNT(*) as count,
//        COALESCE(SUM(student_count), 0) as totalStudents
//      FROM classes 
//      WHERE department IS NOT NULL 
//      GROUP BY department 
//      ORDER BY count DESC`
//   )
  
//   return {
//     totalClasses: totalResult[0].total,
//     totalStudents: totalResult[0].totalStudents,
//     departmentStats: deptStats as Array<{department: string, count: number, totalStudents: number}>
//   }
// }