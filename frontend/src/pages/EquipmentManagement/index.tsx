import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Input, Modal, Form, message, Card, Tag, Statistic, Row, Col, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import equipmentService from '../../services/equipmentService'

const { Search } = Input

interface Equipment {
  id: number
  name: string
  type: string
  model: string
  manufacturer: string
  purchase_date: string
  status: 'available' | 'in_use' | 'maintenance' | 'damaged'
  lab_id: number
  lab_name: string
  description?: string
  created_at: string
  updated_at: string
}

interface EquipmentStats {
  total: number
  available: number
  in_use: number
  maintenance: number
  damaged: number
}

const EquipmentManagement: React.FC = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)
  const [stats, setStats] = useState<EquipmentStats>({ total: 0, available: 0, in_use: 0, maintenance: 0, damaged: 0 })
  const [form] = Form.useForm()

  const statusColors = {
    available: 'green',
    in_use: 'blue',
    maintenance: 'orange',
    damaged: 'red'
  }

  const statusLabels = {
    available: '可用',
    in_use: '使用中',
    maintenance: '维护中',
    damaged: '损坏'
  }

  const fetchEquipment = async () => {
    setLoading(true)
    try {
      const response = await equipmentService.getAllEquipments()
      setEquipment(response.data)
      
      // 计算统计信息
      const stats = {
        total: response.data.length,
        available: response.data.filter((item: Equipment) => item.status === 'available').length,
        in_use: response.data.filter((item: Equipment) => item.status === 'in_use').length,
        maintenance: response.data.filter((item: Equipment) => item.status === 'maintenance').length,
        damaged: response.data.filter((item: Equipment) => item.status === 'damaged').length,
      }
      setStats(stats)
    } catch (error) {
      message.error('获取设备列表失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchEquipmentStats = async () => {
    try {
      const response = await equipmentService.getEquipmentStats()
      setStats(response.data)
    } catch (error) {
      console.error('获取设备统计失败:', error)
    }
  }

  useEffect(() => {
    fetchEquipment()
    fetchEquipmentStats()
  }, [])

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.type.toLowerCase().includes(searchText.toLowerCase()) ||
    item.model.toLowerCase().includes(searchText.toLowerCase()) ||
    item.manufacturer.toLowerCase().includes(searchText.toLowerCase())
  )

  const handleCreate = () => {
    setEditingEquipment(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record: Equipment) => {
    setEditingEquipment(record)
    form.setFieldsValue({
      ...record,
      purchase_date: record.purchase_date ? new Date(record.purchase_date).toISOString().split('T')[0] : undefined
    })
    setModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个设备吗？此操作不可恢复。',
      onOk: async () => {
        try {
          await equipmentService.deleteEquipment(id)
          message.success('设备删除成功')
          fetchEquipment()
        } catch (error) {
          message.error('删除设备失败')
        }
      },
    })
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      
      if (editingEquipment) {
        await equipmentService.updateEquipment(editingEquipment.id, values)
        message.success('设备更新成功')
      } else {
        await equipmentService.createEquipment(values)
        message.success('设备创建成功')
      }
      
      setModalVisible(false)
      fetchEquipment()
    } catch (error) {
      message.error(editingEquipment ? '更新设备失败' : '创建设备失败')
    }
  }

  const handleModalCancel = () => {
    setModalVisible(false)
    form.resetFields()
  }

  const columns: ColumnsType<Equipment> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '设备类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '型号',
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: '制造商',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={statusColors[status as keyof typeof statusColors]}>
          {statusLabels[status as keyof typeof statusLabels]}
        </Tag>
      ),
    },
    {
      title: '所属实验室',
      dataIndex: 'lab_name',
      key: 'lab_name',
    },
    {
      title: '购买日期',
      dataIndex: 'purchase_date',
      key: 'purchase_date',
      render: (date: string) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="设备总数" value={stats.total} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="可用设备" 
              value={stats.available} 
              valueStyle={{ color: '#3f8600' }} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="使用中" 
              value={stats.in_use} 
              valueStyle={{ color: '#1890ff' }} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic 
              title="维护中" 
              value={stats.maintenance} 
              valueStyle={{ color: '#fa8c16' }} 
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建设备
            </Button>
            <Search
              placeholder="搜索设备名称、类型、型号或制造商"
              allowClear
              enterButton={<SearchOutlined />}
              style={{ width: 300 }}
              onSearch={handleSearch}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchEquipment}
            >
              刷新
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={filteredEquipment}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/总共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={editingEquipment ? '编辑设备' : '新建设备'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 'available' }}
        >
          <Form.Item
            label="设备名称"
            name="name"
            rules={[{ required: true, message: '请输入设备名称' }]}
          >
            <Input placeholder="请输入设备名称" />
          </Form.Item>

          <Form.Item
            label="设备类型"
            name="type"
            rules={[{ required: true, message: '请输入设备类型' }]}
          >
            <Input placeholder="如：显微镜、示波器、天平等" />
          </Form.Item>

          <Form.Item
            label="型号"
            name="model"
            rules={[{ required: true, message: '请输入型号' }]}
          >
            <Input placeholder="请输入型号" />
          </Form.Item>

          <Form.Item
            label="制造商"
            name="manufacturer"
            rules={[{ required: true, message: '请输入制造商' }]}
          >
            <Input placeholder="请输入制造商" />
          </Form.Item>

          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Select.Option value="available">可用</Select.Option>
              <Select.Option value="in_use">使用中</Select.Option>
              <Select.Option value="maintenance">维护中</Select.Option>
              <Select.Option value="damaged">损坏</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="所属实验室"
            name="lab_id"
            rules={[{ required: true, message: '请选择所属实验室' }]}
          >
            <Input type="number" placeholder="请输入实验室ID" />
          </Form.Item>

          <Form.Item
            label="购买日期"
            name="purchase_date"
          >
            <Input type="date" />
          </Form.Item>

          <Form.Item
            label="描述"
            name="description"
          >
            <Input.TextArea rows={3} placeholder="请输入设备描述（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default EquipmentManagement