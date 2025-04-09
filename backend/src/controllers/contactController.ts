import { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';

export const sendContactMessage = async (req: Request, res: Response) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ message: 'Email and message are required' });
    }

    // TODO: Implement actual email sending logic here
    // For now, we'll just log the message
    console.log('New contact message:', { email, message });

    res.status(200).json({ message: 'Contact message received successfully' });
  } catch (error) {
    console.error('Error processing contact message:', error);
    res.status(500).json({ message: 'Error processing contact message' });
  }
}; 