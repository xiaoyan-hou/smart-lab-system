import { query } from '../config/database'
import { OkPacket, RowDataPacket } from 'mysql2'

export interface Equipment {
  id: number
  lab_id: number
  name: string
  quantity: number
  students_per_group: number
  status: 'available' | 'in_use' | 'maintenance' | 'inactive'
  created_at: Date
}

export interface EquipmentWithLab extends Equipment {
  lab_code?: string
  lab_name?: string
}

export interface CreateEquipmentData {
  lab_id: number
  name: string
  quantity?: number
  students_per_group?: number
  status?: 'available' | 'in_use' | 'maintenance' | 'inactive'
}

export interface UpdateEquipmentData {
  lab_id?: number
  name?: string
  quantity?: number
  students_per_group?: number
  status?: 'available' | 'in_use' | 'maintenance' | 'inactive'
}

export const createEquipment = async (equipmentData: CreateEquipmentData): Promise<number> => {
  const { 
    lab_id, 
    name, 
    quantity = 1, 
    students_per_group = 1, 
    status = 'available' 
  } = equipmentData
  
  const result = await query<OkPacket>(
    `INSERT INTO equipments (lab_id, name, quantity, students_per_group, status) 
     VALUES (?, ?, ?, ?, ?)`,
    [lab_id, name, quantity, students_per_group, status]
  )
  
  return result.insertId
}

export const getAllEquipments = async (): Promise<EquipmentWithLab[]> => {
  const results = await query<RowDataPacket[]>(
    `SELECT e.*, l.code as lab_code, l.name as lab_name 
     FROM equipments e 
     LEFT JOIN labs l ON e.lab_id = l.id 
     ORDER BY e.created_at DESC`
  )
  
  return results as EquipmentWithLab[]
}

export const getEquipmentById = async (id: number): Promise<EquipmentWithLab | null> => {
  const results = await query<RowDataPacket[]>(
    `SELECT e.*, l.code as lab_code, l.name as lab_name 
     FROM equipments e 
     LEFT JOIN labs l ON e.lab_id = l.id 
     WHERE e.id = ?`,
    [id]
  )
  
  return results.length > 0 ? (results[0] as EquipmentWithLab) : null
}

export const getEquipmentsByLab = async (lab_id: number): Promise<Equipment[]> => {
  const results = await query<RowDataPacket[]>(
    'SELECT * FROM equipments WHERE lab_id = ? ORDER BY name',
    [lab_id]
  )
  
  return results as Equipment[]
}

export const getAvailableEquipments = async (): Promise<EquipmentWithLab[]> => {
  const results = await query<RowDataPacket[]>(
    `SELECT e.*, l.code as lab_code, l.name as lab_name 
     FROM equipments e 
     LEFT JOIN labs l ON e.lab_id = l.id 
     WHERE e.status = "available" 
     ORDER BY e.name`
  )
  
  return results as EquipmentWithLab[]
}

export const updateEquipment = async (id: number, equipmentData: UpdateEquipmentData): Promise<boolean> => {
  const fields = []
  const values = []
  
  for (const [key, value] of Object.entries(equipmentData)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`)
      values.push(value)
    }
  }
  
  if (fields.length === 0) {
    return false
  }
  
  values.push(id)
  
  const result = await query<OkPacket>(
    `UPDATE equipments SET ${fields.join(', ')} WHERE id = ?`,
    values
  )
  
  return result.affectedRows > 0
}

export const deleteEquipment = async (id: number): Promise<boolean> => {
  const result = await query<OkPacket>(
    'DELETE FROM equipments WHERE id = ?',
    [id]
  )
  
  return result.affectedRows > 0
}

export const searchEquipments = async (keyword: string): Promise<EquipmentWithLab[]> => {
  const results = await query<RowDataPacket[]>(
    `SELECT e.*, l.code as lab_code, l.name as lab_name 
     FROM equipments e 
     LEFT JOIN labs l ON e.lab_id = l.id 
     WHERE e.name LIKE ? OR l.code LIKE ? OR l.name LIKE ?
     ORDER BY e.created_at DESC`,
    [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
  )
  
  return results as EquipmentWithLab[]
}