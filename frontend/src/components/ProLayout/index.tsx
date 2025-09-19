import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ProLayout from '@ant-design/pro-layout'
import type { MenuDataItem, ProSettings } from '@ant-design/pro-layout'
import { 
  DashboardOutlined,
  CalendarOutlined,
  UserOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ExperimentOutlined,
  ToolOutlined,
  BankOutlined,
  HomeOutlined,
  ReadOutlined
} from '@ant-design/icons'
import { Avatar, Dropdown, Menu, Space } from 'antd'

const defaultSettings: ProSettings = {
  fixSiderbar: true,
  layout: 'side',
  splitMenus: false,
  navTheme: 'light',
  contentWidth: 'Fluid',
  colorPrimary: '#1890ff',
  fixedHeader: true,
}

const menuData: MenuDataItem[] = [
  {
    path: '/dashboard',
    name: '仪表盘',
    icon: <DashboardOutlined />,
  },
  {
    path: '/basic-data',
    name: '基础数据',
    icon: <BankOutlined />,
    children: [
      {
        path: '/building-management',
        name: '教学楼管理',
        icon: <HomeOutlined />,
      },
      {
        path: '/lab-room-management',
        name: '教室/实验室/机房管理',
        icon: <ExperimentOutlined />,
      },
      {
        path: '/course-management',
        name: '课程管理',
        icon: <ReadOutlined />,
      },
    ],
  },
  {
    path: '/course-schedule',
    name: '排课管理',
    icon: <CalendarOutlined />,
    children: [
      {
        path: '/course-schedule/list',
        name: '课程列表',
      },
      {
        path: '/course-schedule/arrange',
        name: '排课安排',
      },
      {
        path: '/course-schedule/timetable',
        name: '课表查询',
      },
    ],
  },
  {
    path: '/lab-management',
    name: '实验室管理',
    icon: <ExperimentOutlined />,
  },
  {
    path: '/equipment-management',
    name: '设备管理',
    icon: <ToolOutlined />,
  },
  {
    path: '/user',
    name: '用户管理',
    icon: <UserOutlined />,
    children: [
      {
        path: '/user/students',
        name: '学生管理',
      },
      {
        path: '/user/teachers',
        name: '教师管理',
      },
    ],
  },
  {
    path: '/settings',
    name: '系统设置',
    icon: <SettingOutlined />,
  },
]

interface ProLayoutProps {
  children: React.ReactNode
}

const ProLayoutComponent: React.FC<ProLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleMenuClick = (path: string) => {
    navigate(path)
  }

  const avatarMenu = (
    <Menu>
      <Menu.Item key="profile">
        <a>个人中心</a>
      </Menu.Item>
      <Menu.Item key="settings">
        <a>个人设置</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <a>退出登录</a>
      </Menu.Item>
    </Menu>
  )

  const rightContentRender = () => (
    <Space size="large">
      <Dropdown overlay={avatarMenu} placement="bottomRight">
        <Space style={{ cursor: 'pointer' }}>
          <Avatar size="small" icon={<UserOutlined />} />
          <span>管理员</span>
        </Space>
      </Dropdown>
    </Space>
  )

  return (
    <div style={{ height: '100vh' }}>
      <ProLayout
        {...defaultSettings}
        title="智慧实验室系统"
        logo="/vite.svg"
        collapsed={collapsed}
        onCollapse={setCollapsed}
        location={{
          pathname: location.pathname,
        }}
        menuDataRender={() => menuData}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => handleMenuClick(item.path || '/')}
            style={{ cursor: 'pointer' }}
          >
            {dom}
          </div>
        )}
        rightContentRender={rightContentRender}
        collapsedButtonRender={(collapsed) => (
          collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
        )}
      >
        <div style={{ padding: 24, minHeight: 'calc(100vh - 48px)' }}>
          {children}
        </div>
      </ProLayout>
    </div>
  )
}

export default ProLayoutComponent