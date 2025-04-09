export interface User {
  id: number;
  username: string;
  firstname: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
  createdAt: number;
  updatedAt: number;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  username: string;
  firstname: string;
  email: string;
  password: string;
} 