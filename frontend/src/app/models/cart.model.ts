import { Product } from './product.model';

export interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

export interface Cart {
  userId: number;
  items: CartItem[];
  total: number;
  createdAt: number;
  updatedAt: number;
} 