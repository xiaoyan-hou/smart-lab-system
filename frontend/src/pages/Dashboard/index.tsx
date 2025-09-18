import React from 'react'
import { Card, Col, Row, Statistic } from 'antd'
import { 
  UserOutlined, 
  CalendarOutlined, 
  BookOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons'

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>仪表盘</h1>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总学生数"
              value={1280}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总教师数"
              value={85}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日课程"
              value={24}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="实验室预约"
              value={156}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="最近活动" style={{ height: 300 }}>
            <p>系统运行正常</p>
            <p>最新课程安排已更新</p>
            <p>实验室设备检查完成</p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="系统状态" style={{ height: 300 }}>
            <p>数据库连接正常</p>
            <p>所有服务运行稳定</p>
            <p>备份任务执行成功</p>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard