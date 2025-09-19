import { query } from '../config/database'
import { OkPacket, RowDataPacket } from 'mysql2'

export interface CourseOffering {
  id: number
  course_id: number
  semester: string
  teacher_id: number
  teacher_name?: string
  equipment_id?: number
  equipment_name?: string
  lab_hours: number
  groups_per_equipment: number
  group_size?: number
  students_count?: number
  notes?: string
  hours_per_week: number
  created_at: Date
}

export interface CourseOfferingWithDetails extends CourseOffering {
  course_code?: string
  course_name?: string
  course_credit?: number
  course_type?: string
  teacher_department?: string
  teacher_title?: string
}

export interface CreateCourseOfferingData {
  course_id: number
  semester: string
  teacher_id: number
  equipment_id?: number
  lab_hours?: number
  groups_per_equipment?: number
  group_size?: number
  students_count?: number
  notes?: string
  hours_per_week?: number
}

export interface UpdateCourseOfferingData {
  course_id?: number
  semester?: string
  teacher_id?: number
  equipment_id?: number
  lab_hours?: number
  groups_per_equipment?: number
  group_size?: number
  students_count?: number
  notes?: string
  hours_per_week?: number
}

export const createCourseOffering = async (offeringData: CreateCourseOfferingData): Promise<number> => {
  const { 
    course_id, 
    semester, 
    teacher_id, 
    equipment_id, 
    lab_hours = 0, 
    groups_per_equipment = 1, 
    group_size, 
    students_count, 
    notes, 
    hours_per_week = 0 
  } = offeringData;
  
  const result = await query(
    `INSERT INTO course_offerings 
     (course_id, semester, teacher_id, equipment_id, lab_hours, groups_per_equipment, group_size, students_count, notes, hours_per_week) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [course_id, semester, teacher_id, equipment_id, lab_hours, groups_per_equipment, group_size, students_count, notes, hours_per_week]
  ) as OkPacket;
  
  return result.insertId;
};

export const getAllCourseOfferings = async (): Promise<CourseOfferingWithDetails[]> => {
  const results = await query(
    `SELECT 
       co.*,
       c.code as course_code,
       c.name as course_name,
       c.credit as course_credit,
       c.type as course_type,
       t.department as teacher_department,
       t.title as teacher_title
     FROM course_offerings co
     LEFT JOIN courses c ON co.course_id = c.id
     LEFT JOIN teachers t ON co.teacher_id = t.id
     ORDER BY co.created_at DESC`
  ) as RowDataPacket[];
  
  return results as CourseOfferingWithDetails[];
};

export const getCourseOfferingById = async (id: number): Promise<CourseOfferingWithDetails | null> => {
  const results = await query(
    `SELECT 
       co.*,
       c.code as course_code,
       c.name as course_name,
       c.credit as course_credit,
       c.type as course_type,
       t.department as teacher_department,
       t.title as teacher_title
     FROM course_offerings co
     LEFT JOIN courses c ON co.course_id = c.id
     LEFT JOIN teachers t ON co.teacher_id = t.id
     WHERE co.id = ?`,
    [id]
  ) as RowDataPacket[];
  
  return results.length > 0 ? (results[0] as CourseOfferingWithDetails) : null;
};

export const getCourseOfferingsBySemester = async (semester: string): Promise<CourseOfferingWithDetails[]> => {
  const results = await query(
    `SELECT 
       co.*,
       c.code as course_code,
       c.name as course_name,
       c.credit as course_credit,
       c.type as course_type,
       t.department as teacher_department,
       t.title as teacher_title
     FROM course_offerings co
     LEFT JOIN courses c ON co.course_id = c.id
     LEFT JOIN teachers t ON co.teacher_id = t.id
     WHERE co.semester = ?
     ORDER BY co.created_at DESC`,
    [semester]
  ) as RowDataPacket[];
  
  return results as CourseOfferingWithDetails[];
};

export const getCourseOfferingsByTeacher = async (teacher_id: number): Promise<CourseOfferingWithDetails[]> => {
  const results = await query(
    `SELECT 
       co.*,
       c.code as course_code,
       c.name as course_name,
       c.credit as course_credit,
       c.type as course_type,
       t.department as teacher_department,
       t.title as teacher_title
     FROM course_offerings co
     LEFT JOIN courses c ON co.course_id = c.id
     LEFT JOIN teachers t ON co.teacher_id = t.id
     WHERE co.teacher_id = ?
     ORDER BY co.semester DESC, co.created_at DESC`,
    [teacher_id]
  ) as RowDataPacket[];
  
  return results as CourseOfferingWithDetails[];
};

export const getCourseOfferingsByCourse = async (course_id: number): Promise<CourseOfferingWithDetails[]> => {
  const results = await query(
    `SELECT 
       co.*,
       c.code as course_code,
       c.name as course_name,
       c.credit as course_credit,
       c.type as course_type,
       t.department as teacher_department,
       t.title as teacher_title
     FROM course_offerings co
     LEFT JOIN courses c ON co.course_id = c.id
     LEFT JOIN teachers t ON co.teacher_id = t.id
     WHERE co.course_id = ?
     ORDER BY co.semester DESC, co.created_at DESC`,
    [course_id]
  ) as RowDataPacket[];
  
  return results as CourseOfferingWithDetails[];
};

export const updateCourseOffering = async (id: number, offeringData: UpdateCourseOfferingData): Promise<boolean> => {
  const fields = []
  const values = []
  
  for (const [key, value] of Object.entries(offeringData)) {
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
    `UPDATE course_offerings SET ${fields.join(', ')} WHERE id = ?`,
    values
  ) as OkPacket;
  
  return result.affectedRows > 0;
};

export const deleteCourseOffering = async (id: number): Promise<boolean> => {
  const result = await query(
    'DELETE FROM course_offerings WHERE id = ?',
    [id]
  ) as OkPacket;
  
  return result.affectedRows > 0;
};

export const searchCourseOfferings = async (keyword: string): Promise<CourseOfferingWithDetails[]> => {
  const results = await query(
    `SELECT 
       co.*,
       c.code as course_code,
       c.name as course_name,
       c.credit as course_credit,
       c.type as course_type,
       t.department as teacher_department,
       t.title as teacher_title
     FROM course_offerings co
     LEFT JOIN courses c ON co.course_id = c.id
     LEFT JOIN teachers t ON co.teacher_id = t.id
     WHERE c.code LIKE ? OR c.name LIKE ? OR co.semester LIKE ? OR t.name LIKE ?
     ORDER BY co.created_at DESC`,
    [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
  ) as RowDataPacket[];
  
  return results as CourseOfferingWithDetails[];
}