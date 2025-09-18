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
  model?: string
  serial_number?: string
  category?: string
  manufacturer?: string
  purchase_date?: string
  purchase_price?: number
  description?: string
  specifications?: string
}

export interface UpdateEquipmentData {
  lab_id?: number
  name?: string
  quantity?: number
  students_per_group?: number
  status?: 'available' | 'in_use' | 'maintenance' | 'inactive'
  description?: string
  specifications?: string
  manufacturer?: string
  purchase_date?: string
  purchase_price?: number
  model?: string
  serial_number?: string
  category?: string
}

export const createEquipment = async (equipmentData: CreateEquipmentData): Promise<number> => {
  const { 
    lab_id, 
    name, 
    quantity = 1, 
    students_per_group = 1, 
    status = 'available' 
  } = equipmentData
  
  const result = await query(
    `INSERT INTO equipments (lab_id, name, quantity, students_per_group, status) 
     VALUES (?, ?, ?, ?, ?)`,
    [lab_id, name, quantity, students_per_group, status]
  ) as OkPacket
  
  return result.insertId
}

export const getAllEquipments = async (): Promise<EquipmentWithLab[]> => {
  const results = await query(
    `SELECT e.*, l.code as lab_code, l.name as lab_name 
     FROM equipments e 
     LEFT JOIN labs l ON e.lab_id = l.id 
     ORDER BY e.created_at DESC`
  ) as RowDataPacket[]
  
  return results as EquipmentWithLab[]
}

export const getEquipmentById = async (id: number): Promise<EquipmentWithLab | null> => {
  const results = await query(
    `SELECT e.*, l.code as lab_code, l.name as lab_name 
     FROM equipments e 
     LEFT JOIN labs l ON e.lab_id = l.id 
     WHERE e.id = ?`,
    [id]
  ) as RowDataPacket[]
  
  return results.length > 0 ? (results[0] as EquipmentWithLab) : null
}

export const getEquipmentsByLab = async (lab_id: number): Promise<Equipment[]> => {
  const results = await query(
    'SELECT * FROM equipments WHERE lab_id = ? ORDER BY name',
    [lab_id]
  ) as RowDataPacket[]
  
  return results as Equipment[]
}

export const getAvailableEquipments = async (): Promise<EquipmentWithLab[]> => {
  const results = await query(
    `SELECT e.*, l.code as lab_code, l.name as lab_name 
     FROM equipments e 
     LEFT JOIN labs l ON e.lab_id = l.id 
     WHERE e.status = "available" 
     ORDER BY e.name`
  ) as RowDataPacket[]
  
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
  
  const result = await query(
    `UPDATE equipments SET ${fields.join(', ')} WHERE id = ?`,
    values
  ) as OkPacket
  
  return result.affectedRows > 0
}

export const deleteEquipment = async (id: number): Promise<boolean> => {
  const result = await query(
    'DELETE FROM equipments WHERE id = ?',
    [id]
  ) as OkPacket
  
  return result.affectedRows > 0
}

export const searchEquipments = async (keyword: string): Promise<EquipmentWithLab[]> => {
  const results = await query(
    `SELECT e.*, l.code as lab_code, l.name as lab_name 
     FROM equipments e 
     LEFT JOIN labs l ON e.lab_id = l.id 
     WHERE e.name LIKE ? OR l.code LIKE ? OR l.name LIKE ?
     ORDER BY e.created_at DESC`,
    [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
  ) as RowDataPacket[]
  
  return results as EquipmentWithLab[]
}

export const getEquipmentBySerialNumber = async (serial_number: string): Promise<EquipmentWithLab | null> => {
  const results = await query(
    `SELECT e.*, l.code as lab_code, l.name as lab_name 
     FROM equipments e 
     LEFT JOIN labs l ON e.lab_id = l.id 
     WHERE e.serial_number = ?`,
    [serial_number]
  ) as RowDataPacket[]
  
  return results.length > 0 ? (results[0] as EquipmentWithLab) : null
}

export const getEquipmentsByFilter = async (filters: {
  lab_id?: number
  category?: string
  status?: string
}): Promise<EquipmentWithLab[]> => {
  let queryStr = `SELECT e.*, l.code as lab_code, l.name as lab_name 
                  FROM equipments e 
                  LEFT JOIN labs l ON e.lab_id = l.id 
                  WHERE 1=1`
  const params: any[] = []
  
  if (filters.lab_id) {
    queryStr += ' AND e.lab_id = ?'
    params.push(filters.lab_id)
  }
  
  if (filters.category) {
    queryStr += ' AND e.category = ?'
    params.push(filters.category)
  }
  
  if (filters.status) {
    queryStr += ' AND e.status = ?'
    params.push(filters.status)
  }
  
  queryStr += ' ORDER BY e.created_at DESC'
  
  const results = await query(queryStr, params) as RowDataPacket[]
  
  return results as EquipmentWithLab[]
}

export const getEquipmentStats = async (): Promise<any> => {
  const results = await query(`
    SELECT 
      COUNT(*) as total_equipment,
      COUNT(CASE WHEN status = 'available' THEN 1 END) as available_equipment,
      COUNT(CASE WHEN status = 'in_use' THEN 1 END) as in_use_equipment,
      COUNT(CASE WHEN status = 'maintenance' THEN 1 END) as maintenance_equipment,
      COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_equipment,
      SUM(quantity) as total_quantity
    FROM equipments
  `) as RowDataPacket[]
  
  return results.length > 0 ? results[0] : null
}