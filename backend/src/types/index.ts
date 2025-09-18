export interface User {
  id: number;
  username: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
  created_at: Date;
  updated_at: Date;
}

export interface Teacher {
  id: number;
  teacher_id: string;
  name: string;
  department?: string;
  title?: string;
}

export interface Student {
  id: number;
  student_id: string;
  name: string;
  major?: string;
  class?: string;
}

export interface Lab {
  id: number;
  lab_name: string;
  lab_number?: string;
  capacity?: number;
  location?: string;
  equipment?: string;
  status: 'available' | 'maintenance' | 'closed';
  created_at: Date;
  updated_at: Date;
}

export interface Course {
  id: number;
  course_code: string;
  course_name: string;
  credit?: number;
  course_type: 'theory' | 'experiment';
  description?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Schedule {
  id: number;
  course_id: number;
  teacher_id: number;
  lab_id: number;
  week_day: '1' | '2' | '3' | '4' | '5' | '6' | '7';
  start_time: string;
  end_time: string;
  start_week: number;
  end_week: number;
  semester: string;
  school_year: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    user: Omit<User, 'password_hash'>;
    token: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}