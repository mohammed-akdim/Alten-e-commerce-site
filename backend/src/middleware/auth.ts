import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.email !== 'admin@admin.com') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}; 