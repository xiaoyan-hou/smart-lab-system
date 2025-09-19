import React, { useState, useEffect } from 'react'
import { Card, Table, Button, Space, Input, Modal, Form, message, Select } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

interface LabRoom {
  id: number
  code: string
  name: string
  building_id: number
  building_name: string
  room_number: string
  room_capacity: number
  status: 'available' | 'maintenance' | 'inactive'
  description?: string
  created_at: string
}

const LabRoomManagement: React.FC = () => {
  const [labRooms, setLabRooms] = useState<LabRoom[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingLabRoom, setEditingLabRoom] = useState<LabRoom | null>(null)
  const [form] = Form.useForm()
  const [searchText, setSearchText] = useState('')

  // 模拟教学楼数据
  const buildings = [
    { id: 1, name: '理科实验楼' },
    { id: 2, name: '工科楼' },
    { id: 3, name: '信息楼' }
  ]

  // 模拟数据
  const mockLabRooms: LabRoom[] = [
    {
      id: 1,
      code: 'LAB001',
      name: '计算机实验室A',
      building_id: 1,
      building_name: '理科实验楼',
      room_number: '101',
      room_capacity: 60,
      status: 'available',
      description: '配备60台计算机的实验室',
      created_at: '2024-01-15 10:00:00'
    },
    {
      id: 2,
      code: 'LAB002',
      name: '软件工程实验室',
      building_id: 1,
      building_name: '理科实验楼',
      room_number: '201',
      room_capacity: 40,
      status: 'available',
      description: '软件工程专用实验室',
      created_at: '2024-01-16 09:30:00'
    }
  ]

  useEffect(() => {
    fetchLabRooms()
  }, [])

  const fetchLabRooms = async () => {
    setLoading(true)
    try {
      // 这里应该调用实际的API
      setTimeout(() => {
        setLabRooms(mockLabRooms)
        setLoading(false)
      }, 500)
    } catch (error) {
      message.error('获取教室/实验室列表失败')
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingLabRoom(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (labRoom: LabRoom) => {
    setEditingLabRoom(labRoom)
    form.setFieldsValue(labRoom)
    setModalVisible(true)
  }

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个教室/实验室吗？',
      onOk: async () => {
        try {
          // 这里应该调用实际的API
          setLabRooms(labRooms.filter(item => item.id !== id))
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
      const buildingName = buildings.find(b => b.id === values.building_id)?.name || ''
      
      if (editingLabRoom) {
        // 编辑模式
        const updatedLabRooms = labRooms.map(item =>
          item.id === editingLabRoom.id 
            ? { ...item, ...values, building_name: buildingName } 
            : item
        )
        setLabRooms(updatedLabRooms)
        message.success('更新成功')
      } else {
        // 新增模式
        const newLabRoom: LabRoom = {
          id: Date.now(),
          ...values,
          building_name: buildingName,
          created_at: new Date().toLocaleString()
        }
        setLabRooms([...labRooms, newLabRoom])
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

  const filteredLabRooms = labRooms.filter(labRoom =>
    labRoom.name.toLowerCase().includes(searchText.toLowerCase()) ||
    labRoom.code.toLowerCase().includes(searchText.toLowerCase()) ||
    labRoom.building_name.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns: ColumnsType<LabRoom> = [
    {
      title: '编号',
      dataIndex: 'code',
      key: 'code',
      width: 100
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '教学楼',
      dataIndex: 'building_name',
      key: 'building_name',
      width: 120
    },
    {
      title: '房间号',
      dataIndex: 'room_number',
      key: 'room_number',
      width: 100
    },
    {
      title: '容量',
      dataIndex: 'room_capacity',
      key: 'room_capacity',
      width: 80,
      render: (capacity: number) => `${capacity}人`
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap = {
          available: { text: '可用', color: 'green' },
          maintenance: { text: '维护中', color: 'orange' },
          inactive: { text: '停用', color: 'red' }
        }
        const statusInfo = statusMap[status as keyof typeof statusMap]
        return <span style={{ color: statusInfo?.color }}>{statusInfo?.text}</span>
      }
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
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
            placeholder="搜索教室/实验室编号、名称或教学楼"
            prefix={<SearchOutlined />}
            style={{ width: 350 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增教室/实验室
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredLabRooms}
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
        title={editingLabRoom ? '编辑教室/实验室' : '新增教室/实验室'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="房间编号"
            rules={[{ required: true, message: '请输入房间编号' }]}
          >
            <Input placeholder="例如：LAB001" />
          </Form.Item>
          <Form.Item
            name="name"
            label="房间名称"
            rules={[{ required: true, message: '请输入房间名称' }]}
          >
            <Input placeholder="例如：计算机实验室A" />
          </Form.Item>
          <Form.Item
            name="building_id"
            label="所属教学楼"
            rules={[{ required: true, message: '请选择教学楼' }]}
          >
            <Select placeholder="请选择教学楼">
              {buildings.map(building => (
                <Select.Option key={building.id} value={building.id}>
                  {building.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Form.Item
              name="room_number"
              label="房间号"
              rules={[{ required: true, message: '请输入房间号' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="例如：101" />
            </Form.Item>
            <Form.Item
              name="room_capacity"
              label="容量"
              rules={[{ required: true, message: '请输入容量' }]}
              style={{ flex: 1 }}
            >
              <Input type="number" placeholder="人数" min={1} />
            </Form.Item>
            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
              style={{ flex: 1 }}
              initialValue="available"
            >
              <Select placeholder="请选择状态">
                <Select.Option value="available">可用</Select.Option>
                <Select.Option value="maintenance">维护中</Select.Option>
                <Select.Option value="inactive">停用</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea placeholder="请输入房间描述信息" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default LabRoomManagement