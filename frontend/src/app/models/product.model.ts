export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  quantity: number;
  inventoryStatus: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id?: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: Date;
} 