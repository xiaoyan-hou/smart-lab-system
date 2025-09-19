import React, { useState } from 'react'
import { Card, Table, Button, Space, DatePicker, Select, Input } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { RangePicker } = DatePicker
const { Option } = Select

interface CourseData {
  key: string
  courseName: string
  teacher: string
  lab: string
  date: string
  timeSlot: string
  status: string
  students: number
}

const CourseSchedule: React.FC = () => {
  const [selectedLab, setSelectedLab] = useState<string>('')

  const columns: ColumnsType<CourseData> = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '任课教师',
      dataIndex: 'teacher',
      key: 'teacher',
    },
    {
      title: '实验室',
      dataIndex: 'lab',
      key: 'lab',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '时间段',
      dataIndex: 'timeSlot',
      key: 'timeSlot',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === '已安排' ? 'green' : 'orange'
        return <span style={{ color }}>{status}</span>
      },
    },
    {
      title: '学生数',
      dataIndex: 'students',
      key: 'students',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small" danger>删除</Button>
        </Space>
      ),
    },
  ]

  const data: CourseData[] = [
    {
      key: '1',
      courseName: '计算机基础',
      teacher: '张老师',
      lab: '实验室A101',
      date: '2024-01-15',
      timeSlot: '08:00-10:00',
      status: '已安排',
      students: 30,
    },
    {
      key: '2',
      courseName: '数据结构',
      teacher: '李老师',
      lab: '实验室B201',
      date: '2024-01-15',
      timeSlot: '10:00-12:00',
      status: '已安排',
      students: 25,
    },
    {
      key: '3',
      courseName: '算法设计',
      teacher: '王老师',
      lab: '实验室A102',
      date: '2024-01-16',
      timeSlot: '14:00-16:00',
      status: '待安排',
      students: 28,
    },
  ]

  return (
    <div>
      <h1>排课管理</h1>
      
      <Card style={{ marginTop: 16 }}>
        <Space style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />}>
            新增排课
          </Button>
          <RangePicker />
          <Select 
            placeholder="选择实验室" 
            style={{ width: 150 }}
            value={selectedLab}
            onChange={setSelectedLab}
          >
            <Option value="">全部实验室</Option>
            <Option value="A101">实验室A101</Option>
            <Option value="B201">实验室B201</Option>
            <Option value="A102">实验室A102</Option>
          </Select>
          <Input 
            placeholder="搜索课程或教师" 
            style={{ width: 200 }}
            prefix={<SearchOutlined />}
          />
        </Space>
        
        <Table 
          columns={columns} 
          dataSource={data} 
          style={{ marginTop: 16 }}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>
    </div>
  )
}

export default CourseSchedule