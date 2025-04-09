import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { DataService } from '../services/dataService';
import { UserRegister, UserLogin } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const dataService = DataService.getInstance();

export const register = async (req: Request, res: Response) => {
  try {
    const { username, firstname, email, password }: UserRegister = req.body;

    if (!username || !firstname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = dataService.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = dataService.createUser({
      username,
      firstname,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({
      ...userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login attempt with:', req.body);
    const { email, password }: UserLogin = req.body;

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Trim inputs
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    console.log('Sanitized inputs:', { email: trimmedEmail, password: '***' });

    const user = dataService.getUserByEmail(trimmedEmail);
    console.log('Found user:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('User not found for email:', trimmedEmail);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Comparing passwords...');
    console.log('Input password length:', trimmedPassword.length);
    console.log('Stored hash:', user.password);
    
    try {
      const isValidPassword = await bcrypt.compare(trimmedPassword, user.password);
      console.log('Password comparison result:', isValidPassword);
      
      if (!isValidPassword) {
        console.log('Invalid password for user:', trimmedEmail);
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } catch (bcryptError) {
      console.error('bcrypt comparison error:', bcryptError);
      return res.status(500).json({ message: 'Error validating credentials' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role 
      }, 
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    console.log('Generated token for user:', trimmedEmail);
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      ...userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
}; 