import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import ProLayout from './components/ProLayout'
import Dashboard from './pages/Dashboard'
import CourseSchedule from './pages/CourseSchedule'
import CourseManagement from './pages/CourseManagement'
import LabManagement from './pages/LabManagement'
import EquipmentManagement from './pages/EquipmentManagement'
import BuildingManagement from './pages/BuildingManagement'
import LabRoomManagement from './pages/LabRoomManagement'
import './App.css'

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <ProLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/building-management" element={<BuildingManagement />} />
            <Route path="/lab-room-management" element={<LabRoomManagement />} />
            <Route path="/course-management" element={<CourseManagement />} />
            <Route path="/course-schedule" element={<CourseSchedule />} />
            <Route path="/lab-management" element={<LabManagement />} />
            <Route path="/equipment-management" element={<EquipmentManagement />} />
          </Routes>
        </ProLayout>
      </Router>
    </ConfigProvider>
  )
}

export default App