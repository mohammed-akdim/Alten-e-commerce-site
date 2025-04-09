import { User } from './user.model';
import { CartItem } from './cart.model';

export interface Order {
  id: number;
  userId: number;
  user?: User; // Optional: Embed user details
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: number; // Use number for timestamps (ms since epoch)
  updatedAt: number; 
} 