export interface User {
  id: string;
  username: string;
  firstname: string;
  email: string;
  role?: 'user' | 'admin';
  token: string;
  createdAt?: number;
  updatedAt?: number;
} 