import { query } from '../config/database'
import { OkPacket, RowDataPacket } from 'mysql2'

export interface Lab {
  id: number
  code: string
  name: string
  building_id: number
  building_name?: string
  room_number?: string
  room_capacity: number
  lab_type?: string
  equipment_count?: number
  status: 'available' | 'maintenance' | 'inactive'
  description?: string
  created_at: Date
}

export interface CreateLabData {
  code: string
  name: string
  building_id: number
  building_name?: string
  room_number?: string
  room_capacity?: number
  lab_type?: string
  equipment_count?: number
  status?: 'available' | 'maintenance' | 'inactive'
  description?: string
}

export interface UpdateLabData {
  code?: string
  name?: string
  building_id?: number
  building_name?: string
  room_number?: string
  room_capacity?: number
  lab_type?: string
  equipment_count?: number
  status?: 'available' | 'maintenance' | 'inactive'
  description?: string
}

export const createLab = async (labData: CreateLabData): Promise<number> => {
  const { 
    code, 
    name, 
    building_id, 
    building_name, 
    room_number, 
    room_capacity = 100, 
    lab_type,
    equipment_count,
    status = 'available', 
    description 
  } = labData
  
  const result = await query(
    `INSERT INTO labs (code, name, building_id, building_name, room_number, room_capacity, lab_type, equipment_count, status, description) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [code, name, building_id, building_name, room_number, room_capacity, lab_type, equipment_count, status, description]
  ) as OkPacket
  
  return result.insertId
}

export const getAllLabs = async (): Promise<Lab[]> => {
  const results = await query(
    'SELECT * FROM labs ORDER BY created_at DESC'
  ) as RowDataPacket[]
  
  return results as Lab[]
}

export const getLabById = async (id: number): Promise<Lab | null> => {
  const results = await query(
    'SELECT * FROM labs WHERE id = ?',
    [id]
  ) as RowDataPacket[]
  
  return results.length > 0 ? (results[0] as Lab) : null
}

export const getLabByCode = async (code: string): Promise<Lab | null> => {
  const results = await query(
    'SELECT * FROM labs WHERE code = ?',
    [code]
  ) as RowDataPacket[]
  
  return results.length > 0 ? (results[0] as Lab) : null
}

export const getLabByName = async (name: string): Promise<Lab | null> => {
  const results = await query(
    'SELECT * FROM labs WHERE name = ?',
    [name]
  ) as RowDataPacket[]
  
  return results.length > 0 ? (results[0] as Lab) : null
}

export const getLabsByBuilding = async (building_id: number): Promise<Lab[]> => {
  const results = await query(
    'SELECT * FROM labs WHERE building_id = ? ORDER BY code',
    [building_id]
  ) as RowDataPacket[]
  
  return results as Lab[]
}

export const getAvailableLabs = async (): Promise<Lab[]> => {
  const results = await query(
    'SELECT * FROM labs WHERE status = "available" ORDER BY code'
  ) as RowDataPacket[]
  
  return results as Lab[]
}

export const updateLab = async (id: number, labData: UpdateLabData): Promise<boolean> => {
  const fields = []
  const values = []
  
  for (const [key, value] of Object.entries(labData)) {
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
    `UPDATE labs SET ${fields.join(', ')} WHERE id = ?`,
    values
  ) as OkPacket
  
  return result.affectedRows > 0
}

export const deleteLab = async (id: number): Promise<boolean> => {
  const result = await query(
    'DELETE FROM labs WHERE id = ?',
    [id]
  ) as OkPacket
  
  return result.affectedRows > 0
}

export const getLabEquipment = async (labId: number): Promise<any[]> => {
  const results = await query(
    `SELECT e.*, l.name as lab_name 
     FROM equipment e 
     JOIN labs l ON e.lab_id = l.id 
     WHERE e.lab_id = ? 
     ORDER BY e.name`,
    [labId]
  ) as RowDataPacket[]
  
  return results
}

export const getLabsByFilter = async (filters: {
  building_id?: number
  lab_type?: string
  status?: string
}): Promise<Lab[]> => {
  let queryStr = 'SELECT * FROM labs WHERE 1=1'
  const params: any[] = []
  
  if (filters.building_id) {
    queryStr += ' AND building_id = ?'
    params.push(filters.building_id)
  }
  
  if (filters.lab_type) {
    queryStr += ' AND lab_type = ?'
    params.push(filters.lab_type)
  }
  
  if (filters.status) {
    queryStr += ' AND status = ?'
    params.push(filters.status)
  }
  
  queryStr += ' ORDER BY created_at DESC'
  
  const results = await query(queryStr, params) as RowDataPacket[]
  
  return results as Lab[]
}

export const searchLabs = async (keyword: string): Promise<Lab[]> => {
  const results = await query(
    `SELECT * FROM labs 
     WHERE code LIKE ? OR name LIKE ? OR building_name LIKE ? OR room_number LIKE ?
     ORDER BY created_at DESC`,
    [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
  ) as RowDataPacket[]
  
  return results as Lab[]
}