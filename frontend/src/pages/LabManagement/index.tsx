import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Card, Row, Col, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import { getLabs, createLab, updateLab, deleteLab } from '../../services/labService'

const { Option } = Select
const { TextArea } = Input

interface Lab {
  id: number
  name: string
  building: string
  floor: number
  room_number: string
  capacity: number
  lab_type: 'general' | 'specialized' | 'research'
  description?: string
  equipment_count: number
  status: 'active' | 'maintenance' | 'inactive'
  created_at: string
  updated_at: string
}

interface LabFormData {
  name: string
  building: string
  floor: number
  room_number: string
  capacity: number
  lab_type: 'general' | 'specialized' | 'research'
  description?: string
  equipment_count: number
  status: 'active' | 'maintenance' | 'inactive'
}

const LabManagement: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingLab, setEditingLab] = useState<Lab | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [form] = Form.useForm()

  // 获取实验室列表
  const fetchLabs = async () => {
    setLoading(true)
    try {
      const response = await getLabs()
      if (response.success) {
        setLabs(response.data)
      } else {
        message.error(response.message || '获取实验室列表失败')
      }
    } catch (error) {
      message.error('获取实验室列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 显示创建/编辑模态框
  const showModal = (lab?: Lab) => {
    setEditingLab(lab || null)
    if (lab) {
      form.setFieldsValue(lab)
    } else {
      form.resetFields()
      form.setFieldsValue({
        lab_type: 'general',
        status: 'active',
        equipment_count: 0
      })
    }
    setModalVisible(true)
  }

  // 关闭模态框
  const handleCancel = () => {
    setModalVisible(false)
    setEditingLab(null)
    form.resetFields()
  }

  // 提交表单
  const handleSubmit = async (values: LabFormData) => {
    try {
      if (editingLab) {
        // 编辑实验室
        const response = await updateLab(editingLab.id, values)
        if (response.success) {
          message.success('实验室更新成功')
          fetchLabs()
          handleCancel()
        } else {
          message.error(response.message || '实验室更新失败')
        }
      } else {
        // 创建实验室
        const response = await createLab(values)
        if (response.success) {
          message.success('实验室创建成功')
          fetchLabs()
          handleCancel()
        } else {
          message.error(response.message || '实验室创建失败')
        }
      }
    } catch (error) {
      message.error(editingLab ? '实验室更新失败' : '实验室创建失败')
    }
  }

  // 删除实验室
  const handleDelete = async (id: number) => {
    try {
      const response = await deleteLab(id)
      if (response.success) {
        message.success('实验室删除成功')
        fetchLabs()
      } else {
        message.error(response.message || '实验室删除失败')
      }
    } catch (error) {
      message.error('实验室删除失败')
    }
  }

  useEffect(() => {
    fetchLabs()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green'
      case 'maintenance':
        return 'orange'
      case 'inactive':
        return 'red'
      default:
        return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '正常'
      case 'maintenance':
        return '维护中'
      case 'inactive':
        return '停用'
      default:
        return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'general':
        return '通用实验室'
      case 'specialized':
        return '专业实验室'
      case 'research':
        return '研究实验室'
      default:
        return type
    }
  }

  const columns: ColumnsType<Lab> = [
    {
      title: '实验室名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '所在位置',
      key: 'location',
      width: 150,
      render: (_, record) => `${record.building} ${record.floor}楼 ${record.room_number}`,
    },
    {
      title: '容纳人数',
      dataIndex: 'capacity',
      key: 'capacity',
      width: 100,
      align: 'center',
    },
    {
      title: '实验室类型',
      dataIndex: 'lab_type',
      key: 'lab_type',
      width: 120,
      render: (type: string) => getTypeText(type),
    },
    {
      title: '设备数量',
      dataIndex: 'equipment_count',
      key: 'equipment_count',
      width: 100,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
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
            title="确定要删除这个实验室吗？"
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
              placeholder="搜索实验室名称"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              suffix={<SearchOutlined style={{ cursor: 'pointer' }} />}
            />
          </Col>
          <Col span={16} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              新建实验室
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={labs}
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
        title={editingLab ? '编辑实验室' : '新建实验室'}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="实验室名称"
            rules={[{ required: true, message: '请输入实验室名称' }]}
          >
            <Input placeholder="请输入实验室名称" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="building"
                label="所在楼宇"
                rules={[{ required: true, message: '请输入所在楼宇' }]}
              >
                <Input placeholder="请输入所在楼宇" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="floor"
                label="楼层"
                rules={[{ required: true, message: '请输入楼层' }]}
              >
                <InputNumber
                  min={1}
                  max={20}
                  style={{ width: '100%' }}
                  placeholder="楼层"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="room_number"
                label="房间号"
                rules={[{ required: true, message: '请输入房间号' }]}
              >
                <Input placeholder="房间号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label="容纳人数"
                rules={[{ required: true, message: '请输入容纳人数' }]}
              >
                <InputNumber
                  min={1}
                  max={200}
                  style={{ width: '100%' }}
                  placeholder="请输入容纳人数"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lab_type"
                label="实验室类型"
                rules={[{ required: true, message: '请选择实验室类型' }]}
              >
                <Select placeholder="请选择实验室类型">
                  <Option value="general">通用实验室</Option>
                  <Option value="specialized">专业实验室</Option>
                  <Option value="research">研究实验室</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="equipment_count"
                label="设备数量"
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="请输入设备数量"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="状态"
              >
                <Select placeholder="请选择状态">
                  <Option value="active">正常</Option>
                  <Option value="maintenance">维护中</Option>
                  <Option value="inactive">停用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="实验室描述"
          >
            <TextArea
              rows={3}
              placeholder="请输入实验室描述（可选）"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={handleCancel}>取消</Button>
              <Button type="primary" htmlType="submit">
                {editingLab ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default LabManagement