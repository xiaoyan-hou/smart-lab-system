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

// 获取所有课程
export const getCourses = async () => {
  try {
    const response = await api.get('/courses')
    return response.data
  } catch (error) {
    console.error('获取课程列表失败:', error)
    throw error
  }
}

// 创建课程
export const createCourse = async (courseData: any) => {
  try {
    const response = await api.post('/courses', courseData)
    return response.data
  } catch (error) {
    console.error('创建课程失败:', error)
    throw error
  }
}

// 更新课程
export const updateCourse = async (id: number, courseData: any) => {
  try {
    const response = await api.put(`/courses/${id}`, courseData)
    return response.data
  } catch (error) {
    console.error('更新课程失败:', error)
    throw error
  }
}

// 删除课程
export const deleteCourse = async (id: number) => {
  try {
    const response = await api.delete(`/courses/${id}`)
    return response.data
  } catch (error) {
    console.error('删除课程失败:', error)
    throw error
  }
}

// 搜索课程
export const searchCourses = async (keyword: string) => {
  try {
    const response = await api.get(`/courses/search?keyword=${encodeURIComponent(keyword)}`)
    return response.data
  } catch (error) {
    console.error('搜索课程失败:', error)
    throw error
  }
}