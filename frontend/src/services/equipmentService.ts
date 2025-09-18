import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export interface Equipment {
  id?: number
  name: string
  type: string
  model: string
  manufacturer: string
  purchase_date?: string
  status: 'available' | 'in_use' | 'maintenance' | 'damaged'
  lab_id: number
  description?: string
}

export interface EquipmentStats {
  total: number
  available: number
  in_use: number
  maintenance: number
  damaged: number
}

const equipmentService = {
  // 获取所有设备
  getAllEquipments: () => {
    return api.get('/equipment')
  },

  // 获取单个设备
  getEquipmentById: (id: number) => {
    return api.get(`/equipment/${id}`)
  },

  // 创建设备
  createEquipment: (equipment: Equipment) => {
    return api.post('/equipment', equipment)
  },

  // 更新设备
  updateEquipment: (id: number, equipment: Partial<Equipment>) => {
    return api.put(`/equipment/${id}`, equipment)
  },

  // 删除设备
  deleteEquipment: (id: number) => {
    return api.delete(`/equipment/${id}`)
  },

  // 获取设备统计信息
  getEquipmentStats: () => {
    return api.get('/equipment/stats')
  },

  // 搜索设备
  searchEquipments: (query: string) => {
    return api.get(`/equipment/search?q=${encodeURIComponent(query)}`)
  },
}

export default equipmentService