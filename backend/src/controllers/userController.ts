import { Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { User } from '../models/User';

const dataService = DataService.getInstance();

export const getUsers = (req: Request, res: Response) => {
  try {
    const users = dataService.getUsers().map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const getUser = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = dataService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

export const createUser = (req: Request, res: Response) => {
  try {
    const { username, firstname, email, password, role } = req.body;
    if (!username || !firstname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = dataService.createUser({
      username,
      firstname,
      email,
      password,
      role: role || 'user'
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const updateUser = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { username, firstname, email, role } = req.body;
    const updatedUser = dataService.updateUser(id, {
      username,
      firstname,
      email,
      role
    });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

export const deleteUser = (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const success = dataService.deleteUser(id);
    if (!success) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
}; 