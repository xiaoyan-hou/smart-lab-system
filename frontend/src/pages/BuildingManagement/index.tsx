import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Input, Modal, Form, message } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface Building {
  id: number
  building_id: string
  name: string
  notes?: string
  created_at: string
}

const BuildingManagement: React.FC = () => {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')

  // 模拟数据
  const mockBuildings: Building[] = [
    {
      id: 1,
      building_id: 'B01',
      name: '理科实验楼',
      notes: '主要计算机实验室',
      created_at: '2024-01-15 10:00:00'
    },
    {
      id: 2,
      building_id: 'B02',
      name: '工科楼',
      notes: '工程实验室',
      created_at: '2024-01-16 09:30:00'
    }
  ]

  useEffect(() => {
    fetchBuildings()
  }, [])

  const fetchBuildings = async () => {
    setLoading(true)
    try {
      // 这里应该调用实际的API
      setTimeout(() => {
        setBuildings(mockBuildings)
        setLoading(false)
      }, 500)
    } catch (error) {
      message.error('获取教学楼列表失败')
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingBuilding(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (building: Building) => {
    setEditingBuilding(building)
    form.setFieldsValue(building)
    setModalVisible(true)
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个教学楼吗？',
      onOk: async () => {
        try {
          // 这里应该调用实际的API
          setBuildings(buildings.filter(item => item.id !== id))
          message.success('删除成功')
        } catch (error) {
          message.error('删除失败')
        }
      }
    })
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()
      if (editingBuilding) {
        // 编辑模式
        const updatedBuildings = buildings.map(item =>
          item.id === editingBuilding.id ? { ...item, ...values } : item
        )
        setBuildings(updatedBuildings)
        message.success('更新成功')
      } else {
        // 新增模式
        const newBuilding: Building = {
          id: Date.now(),
          ...values,
          created_at: new Date().toLocaleString()
        }
        setBuildings([...buildings, newBuilding])
        message.success('添加成功')
      }
      setModalVisible(false)
      form.resetFields()
    } catch (error) {
      message.error('操作失败')
    }
  }

  const handleModalCancel = () => {
    setModalVisible(false)
    form.resetFields()
  }

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchText.toLowerCase()) ||
    building.building_id.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns: ColumnsType<Building> = [
    {
      title: '编号',
      dataIndex: 'building_id',
      key: 'building_id',
      width: 100
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180
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
      )
    }
  ]

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Input
            placeholder="搜索教学楼编号或名称"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增教学楼
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredBuildings}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条`
          }}
        />
      </Card>

      <Modal
        title={editingBuilding ? '编辑教学楼' : '新增教学楼'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="building_id"
            label="教学楼编号"
            rules={[{ required: true, message: '请输入教学楼编号' }]}
          >
            <Input placeholder="例如：B01" />
          </Form.Item>
          <Form.Item
            name="name"
            label="教学楼名称"
            rules={[{ required: true, message: '请输入教学楼名称' }]}
          >
            <Input placeholder="例如：理科实验楼" />
          </Form.Item>
          <Form.Item
            name="notes"
            label="备注"
          >
            <Input.TextArea placeholder="请输入备注信息" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BuildingManagement