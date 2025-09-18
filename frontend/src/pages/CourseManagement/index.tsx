import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Card, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getCourses, createCourse, updateCourse, deleteCourse, searchCourses } from '../../services/courseService'

const { Option } = Select
const { TextArea } = Input

interface Course {
  id: number
  code: string
  name: string
  credit: number
  total_hours: number
  department: string
  type: 'theory' | 'lab' | 'mixed'
  description?: string
  created_at: string
  updated_at: string
}

interface CourseFormData {
  code: string
  name: string
  credit: number
  total_hours: number
  department: string
  type: 'theory' | 'lab' | 'mixed'
  description?: string
}

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [form] = Form.useForm()

  // 获取课程列表
  const fetchCourses = async () => {
    setLoading(true)
    try {
      const response = await getCourses()
      if (response.success) {
        setCourses(response.data)
      } else {
        message.error(response.message || '获取课程列表失败')
      }
    } catch (error) {
      message.error('获取课程列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 搜索课程
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchCourses()
      return
    }

    setLoading(true)
    try {
      const response = await searchCourses(searchKeyword)
      if (response.success) {
        setCourses(response.data)
      } else {
        message.error(response.message || '搜索失败')
      }
    } catch (error) {
      message.error('搜索失败')
    } finally {
      setLoading(false)
    }
  }

  // 显示创建/编辑模态框
  const showModal = (course?: Course) => {
    setEditingCourse(course || null)
    if (course) {
      form.setFieldsValue(course)
    } else {
      form.resetFields()
    }
    setModalVisible(true)
  }

  // 关闭模态框
  const handleCancel = () => {
    setModalVisible(false)
    setEditingCourse(null)
    form.resetFields()
  }

  // 提交表单
  const handleSubmit = async (values: CourseFormData) => {
    try {
      if (editingCourse) {
        // 编辑课程
        const response = await updateCourse(editingCourse.id, values)
        if (response.success) {
          message.success('课程更新成功')
          fetchCourses()
          handleCancel()
        } else {
          message.error(response.message || '课程更新失败')
        }
      } else {
        // 创建课程
        const response = await createCourse(values)
        if (response.success) {
          message.success('课程创建成功')
          fetchCourses()
          handleCancel()
        } else {
          message.error(response.message || '课程创建失败')
        }
      }
    } catch (error) {
      message.error(editingCourse ? '课程更新失败' : '课程创建失败')
    }
  }

  // 删除课程
  const handleDelete = async (id: number) => {
    try {
      const response = await deleteCourse(id)
      if (response.success) {
        message.success('课程删除成功')
        fetchCourses()
      } else {
        message.error(response.message || '课程删除失败')
      }
    } catch (error) {
      message.error('课程删除失败')
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const columns: ColumnsType<Course> = [
    {
      title: '课程代码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '课程名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '学分',
      dataIndex: 'credit',
      key: 'credit',
      width: 80,
      align: 'center',
    },
    {
      title: '总学时',
      dataIndex: 'total_hours',
      key: 'total_hours',
      width: 100,
      align: 'center',
    },
    {
      title: '开课院系',
      dataIndex: 'department',
      key: 'department',
      width: 150,
    },
    {
      title: '课程类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => {
        const typeMap = {
          theory: '理论课',
          lab: '实验课',
          mixed: '混合课'
        }
        return typeMap[type as keyof typeof typeMap] || type
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这门课程吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="搜索课程代码或名称"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onPressEnter={handleSearch}
              suffix={<SearchOutlined onClick={handleSearch} style={{ cursor: 'pointer' }} />}
            />
          </Col>
          <Col span={16} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              新建课程
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      <Modal
        title={editingCourse ? '编辑课程' : '新建课程'}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            type: 'mixed',
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="课程代码"
                rules={[{ required: true, message: '请输入课程代码' }]}
              >
                <Input placeholder="请输入课程代码" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="课程名称"
                rules={[{ required: true, message: '请输入课程名称' }]}
              >
                <Input placeholder="请输入课程名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="credit"
                label="学分"
                rules={[{ required: true, message: '请输入学分' }]}
              >
                <InputNumber
                  min={0}
                  max={10}
                  style={{ width: '100%' }}
                  placeholder="请输入学分"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="total_hours"
                label="总学时"
                rules={[{ required: true, message: '请输入总学时' }]}
              >
                <InputNumber
                  min={1}
                  max={200}
                  style={{ width: '100%' }}
                  placeholder="请输入总学时"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="department"
                label="开课院系"
                rules={[{ required: true, message: '请输入开课院系' }]}
              >
                <Input placeholder="请输入开课院系" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="type"
                label="课程类型"
                rules={[{ required: true, message: '请选择课程类型' }]}
              >
                <Select placeholder="请选择课程类型">
                  <Option value="theory">理论课</Option>
                  <Option value="lab">实验课</Option>
                  <Option value="mixed">混合课</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="课程描述"
          >
            <TextArea
              rows={4}
              placeholder="请输入课程描述（可选）"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingCourse ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CourseManagement