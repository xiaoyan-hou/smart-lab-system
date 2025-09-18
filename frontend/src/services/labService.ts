import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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

// 获取所有实验室
export const getLabs = async () => {
  try {
    const response = await api.get('/labs')
    return response.data
  } catch (error) {
    console.error('获取实验室列表失败:', error)
    throw error
  }
}

// 创建实验室
export const createLab = async (labData: any) => {
  try {
    const response = await api.post('/labs', labData)
    return response.data
  } catch (error) {
    console.error('创建实验室失败:', error)
    throw error
  }
}

// 更新实验室
export const updateLab = async (id: number, labData: any) => {
  try {
    const response = await api.put(`/labs/${id}`, labData)
    return response.data
  } catch (error) {
    console.error('更新实验室失败:', error)
    throw error
  }
}

// 删除实验室
export const deleteLab = async (id: number) => {
  try {
    const response = await api.delete(`/labs/${id}`)
    return response.data
  } catch (error) {
    console.error('删除实验室失败:', error)
    throw error
  }
}

// 获取实验室设备列表
export const getLabEquipment = async (labId: number) => {
  try {
    const response = await api.get(`/labs/${labId}/equipment`)
    return response.data
  } catch (error) {
    console.error('获取实验室设备失败:', error)
    throw error
  }
}