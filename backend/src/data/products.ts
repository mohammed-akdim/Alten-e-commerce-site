export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro M2',
    description: 'Ordinateur portable Apple avec puce M2, 16GB RAM, 512GB SSD',
    price: 1999.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3',
    category: 'Laptops',
    stock: 10,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    description: 'Dernier iPhone avec caméra pro et puce A17',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.0.3',
    category: 'Smartphones',
    stock: 15,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Sony WH-1000XM4',
    description: 'Casque sans fil avec réduction de bruit active',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3',
    category: 'Audio',
    stock: 20,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'iPad Air',
    description: 'Tablette Apple avec écran Retina 10.9 pouces',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3',
    category: 'Tablets',
    stock: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'Samsung 4K Smart TV',
    description: 'TV LED 65 pouces avec résolution 4K et Smart TV',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-4.0.3',
    category: 'TV',
    stock: 8,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'DJI Mini 3 Pro',
    description: 'Drone compact avec caméra 4K et stabilisation',
    price: 749.99,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3',
    category: 'Drones',
    stock: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    name: 'PlayStation 5',
    description: 'Console de jeu dernière génération avec manette DualSense',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?ixlib=rb-4.0.3',
    category: 'Gaming',
    stock: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    name: 'GoPro Hero 11',
    description: 'Caméra d\'action 5.3K avec stabilisation HyperSmooth',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1526317899290-aac401fd2c8f?ixlib=rb-4.0.3',
    category: 'Cameras',
    stock: 14,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '9',
    name: 'Laptop Ultra Pro',
    description: 'Le nec plus ultra des ordinateurs portables pour professionnels.',
    price: 1899.99,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?ixlib=rb-4.0.3&w=400',
    category: 'Laptops',
    stock: 12,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]; 