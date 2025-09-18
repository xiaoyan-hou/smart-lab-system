# 智慧实验室系统数据库初始化脚本
# MySQL 8.0+ 兼容

-- 创建数据库（如不存在）
CREATE DATABASE IF NOT EXISTS smart_lab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE smart_lab;

-- 用户表
CREATE TABLE `users` ( 
  `id` INT PRIMARY KEY AUTO_INCREMENT, 
  `username` VARCHAR(255) NOT NULL UNIQUE COMMENT '用户名（工号/学号）', 
  `password_hash` VARCHAR(255) NOT NULL COMMENT '加密后的密码', 
  `name` VARCHAR(255) NOT NULL COMMENT '真实姓名', 
  `role` ENUM('admin', 'teacher', 'student') NOT NULL DEFAULT 'teacher' COMMENT '系统角色', 
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT='系统用户表';

-- 教师表
CREATE TABLE `teachers` ( 
  `id` INT PRIMARY KEY AUTO_INCREMENT, 
  `teacher_id` VARCHAR(50) NOT NULL UNIQUE COMMENT '教师工号', 
  `name` VARCHAR(255) NOT NULL COMMENT '教师姓名', 
  `department` VARCHAR(255) COMMENT '所属院系', 
  `title` VARCHAR(50) COMMENT '职称' 
) COMMENT='教师信息表';

-- 班级表
CREATE TABLE `classes` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `class_id` VARCHAR(50) NOT NULL UNIQUE COMMENT '班级编号 （如: 2023cs01）',
  `name` VARCHAR(255) NOT NULL COMMENT '班级名称（如: 计算机科学与技术2023级1班）',
  `major` VARCHAR(255) COMMENT '专业',
  `department` VARCHAR(255) COMMENT '所属院系',
  `student_count` INT COMMENT '学生人数',
  `year` YEAR COMMENT '入学年份',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT='班级信息表';

-- 教学楼信息表
CREATE TABLE `buildings` (
  `id` SERIAL PRIMARY KEY,
  `building_id` TEXT UNIQUE NOT NULL,   -- 楼编号，例如 "B01"
  `name` TEXT NOT NULL,          -- 楼名称，例如 "理科实验楼"
  `notes` TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
) COMMENT='教学楼信息表';;


-- 实验室表
CREATE TABLE labs (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL COMMENT '实验室编号',
    `name` VARCHAR(100) NOT NULL COMMENT '实验室名称',
    building_id INT NOT NULL COMMENT '所属教学楼ID',
    building_name  VARCHAR(120) COMMENT '教学楼名称',
    room_number VARCHAR(20) COMMENT '房间号',
    
    -- 容量相关字段
    room_capacity INT NOT NULL DEFAULT 100 COMMENT '物理安全容量（座位数）',
    
    -- 状态管理
    status ENUM('available', 'maintenance', 'inactive') DEFAULT 'available' COMMENT '状态',
    description TEXT COMMENT '实验室描述',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
) COMMENT='实验室信息表';

-- 设备表（设备即设备组）
CREATE TABLE equipments (
    id SERIAL PRIMARY KEY,
    lab_id INT NOT NULL COMMENT '所属实验室ID',
    
    -- 设备基本信息
    `name` VARCHAR(100) NOT NULL COMMENT '设备组名称',
    
    -- 数量与分组配置
    quantity INT NOT NULL DEFAULT 1 COMMENT '设备套数',
    students_per_group INT NOT NULL DEFAULT 1 COMMENT '每组学生人数',
    
    -- 状态管理
    status ENUM('available', 'in_use', 'maintenance', 'inactive') DEFAULT 'available' COMMENT '状态',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
) COMMENT='设备信息表（设备即设备组）';

-- 课程表
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL COMMENT '课程代码',
    `name` VARCHAR(255) NOT NULL COMMENT '课程名称',
    credit FLOAT NOT NULL COMMENT '学分',
    total_hours INT NOT NULL COMMENT '总学时',
    `department` VARCHAR(255) COMMENT '所属院系',
    `type` ENUM('theory', 'lab', 'mixed') NOT NULL DEFAULT 'mixed' COMMENT '课程类型',
    `description` TEXT COMMENT '课程描述',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) COMMENT='课程字典表';

-- 开课信息表
CREATE TABLE course_offerings (
    id SERIAL PRIMARY KEY,
    course_id INT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    semester VARCHAR(20) NOT NULL COMMENT '学期，如 "2025-2026-1"',
    -- 教师信息
    teacher_id INT NOT NULL REFERENCES teachers(id) ON DELETE RESTRICT,
    teacher_name VARCHAR(255) COMMENT '教师姓名',
    
    -- 实验需求
    equipment_id INT REFERENCES equipments(id) ON DELETE SET NULL,
    equipment_name VARCHAR(255) COMMENT '设备名称',
    lab_hours INT DEFAULT 0 COMMENT '实验学时',
    groups_per_equipment INT DEFAULT 1 COMMENT '每套设备支持的分组数',
    group_size INT COMMENT '每组学生数',
    students_count INT COMMENT '最少学生数',
    
    notes TEXT COMMENT '备注',
    hours_per_week INT DEFAULT 0 COMMENT '每周学时',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 外键约束
    FOREIGN KEY (teacher_id) REFERENCES teachers(id),
    FOREIGN KEY (equipment_id) REFERENCES equipments(id),
    
    -- 索引
    INDEX idx_offerings_semester (semester),
    INDEX idx_offerings_course (course_id),
    INDEX idx_offerings_teacher (teacher_id),
    INDEX idx_offerings_equipment (equipment_id)
) COMMENT='开课信息表';

-- 开课-班级关联表
CREATE TABLE offering_classes (
    id SERIAL PRIMARY KEY,
    offering_id INT NOT NULL REFERENCES course_offerings(id) ON DELETE CASCADE,
    class_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    class_name VARCHAR(255) COMMENT '班级名称',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- 唯一约束，防止重复关联
    UNIQUE(offering_id, class_id),
    
    -- 索引
    INDEX idx_offering_classes_offering (offering_id),
    INDEX idx_offering_classes_class (class_id)
) COMMENT='开课-班级关联表';

-- -- 排课表
-- CREATE TABLE `schedules` ( 
--   `id` INT PRIMARY KEY AUTO_INCREMENT, 
--   `course_id` INT NOT NULL COMMENT '课程ID', 
--   `teacher_id` INT NOT NULL COMMENT '教师ID', 
--   `lab_id` INT NOT NULL COMMENT '实验室ID', 
--   `week_day` ENUM('1', '2', '3', '4', '5', '6', '7') NOT NULL COMMENT '星期几', 
--   `start_time` TIME NOT NULL COMMENT '开始时间', 
--   `end_time` TIME NOT NULL COMMENT '结束时间', 
--   `start_week` INT NOT NULL COMMENT '开始周次', 
--   `end_week` INT NOT NULL COMMENT '结束周次', 
--   `semester` VARCHAR(50) NOT NULL COMMENT '学期', 
--   `school_year` VARCHAR(20) NOT NULL COMMENT '学年', 
--   `status` ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled' COMMENT '状态',
--   `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
--   `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   INDEX idx_teacher_schedule (`teacher_id`, `week_day`, `start_time`),
--   INDEX idx_lab_schedule (`lab_id`, `week_day`, `start_time`),
--   FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`),
--   FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`),
--   FOREIGN KEY (`lab_id`) REFERENCES `labs`(`id`)
-- ) COMMENT='排课信息表';

-- 插入初始管理员用户（密码：admin123）
INSERT INTO `users` (`username`, `password_hash`, `name`, `role`) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '系统管理员', 'admin');

-- 插入示例教师数据
INSERT INTO `teachers` (`teacher_id`, `name`, `department`, `title`) VALUES 
('T001', '张教授', '计算机科学与技术学院', '教授'),
('T002', '李副教授', '软件工程学院', '副教授'),
('T003', '王讲师', '信息工程学院', '讲师');


-- 创建视图：教师用户信息视图
CREATE VIEW teacher_user_view AS
SELECT 
  u.id as user_id,
  u.username,
  u.name as user_name,
  u.role,
  t.id as teacher_id,
  t.teacher_id as teacher_number,
  t.department,
  t.title,
  u.created_at,
  u.updated_at
FROM users u
LEFT JOIN teachers t ON u.username = t.teacher_id
WHERE u.role = 'teacher';

-- 创建索引优化查询性能
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_role ON users(role);
CREATE INDEX idx_teacher_id ON teachers(teacher_id);
-- CREATE INDEX idx_lab_status ON labs(status);
-- CREATE INDEX idx_course_code ON courses(course_code);
-- CREATE INDEX idx_schedule_semester ON schedules(semester, school_year);