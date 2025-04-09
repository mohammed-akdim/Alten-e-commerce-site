import { Product } from './product.model';

export interface Wishlist {
  id: string;
  userId: string;
  items: Product[];
  createdAt: Date;
  updatedAt: Date;
} 