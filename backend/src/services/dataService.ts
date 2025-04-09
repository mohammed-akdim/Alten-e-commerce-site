import fs from 'fs';
import path from 'path';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Cart } from '../models/Cart';
import { Wishlist } from '../models/Wishlist';

const DATA_DIR = path.join(__dirname, '../data');

export class DataService {
  private static instance: DataService;
  private products: Product[] = [];
  private users: User[] = [];
  private carts: Cart[] = [];
  private wishlists: Wishlist[] = [];

  private constructor() {
    this.loadData();
  }

  public static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  private loadData() {
    try {
      console.log('Loading data from:', DATA_DIR);
      
      // Load users
      const usersPath = path.join(DATA_DIR, 'users.json');
      console.log('Loading users from:', usersPath);
      if (fs.existsSync(usersPath)) {
        const userData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        this.users = userData.users;
        console.log('Loaded users:', this.users);
      } else {
        console.log('Users file not found');
      }

      // Load products
      const productsPath = path.join(DATA_DIR, 'products.json');
      if (fs.existsSync(productsPath)) {
        const productData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
        this.products = productData.products;
      }

      // Load carts
      const cartsPath = path.join(DATA_DIR, 'carts.json');
      if (fs.existsSync(cartsPath)) {
        const cartData = JSON.parse(fs.readFileSync(cartsPath, 'utf-8'));
        this.carts = cartData.carts || [];
      }

      // Load wishlists
      const wishlistsPath = path.join(DATA_DIR, 'wishlists.json');
      if (fs.existsSync(wishlistsPath)) {
        const wishlistData = JSON.parse(fs.readFileSync(wishlistsPath, 'utf-8'));
        this.wishlists = wishlistData.wishlists || [];
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  private saveData() {
    try {
      fs.writeFileSync(path.join(DATA_DIR, 'products.json'), JSON.stringify({ products: this.products }, null, 2));
      fs.writeFileSync(path.join(DATA_DIR, 'users.json'), JSON.stringify({ users: this.users }, null, 2));
      fs.writeFileSync(path.join(DATA_DIR, 'carts.json'), JSON.stringify({ carts: this.carts }, null, 2));
      fs.writeFileSync(path.join(DATA_DIR, 'wishlists.json'), JSON.stringify({ wishlists: this.wishlists }, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Product methods
  public getAllProducts(): Product[] {
    return this.products;
  }

  public searchProducts(query: string): Product[] {
    const searchTerm = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }

  public getProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  public createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const newProduct: Product = {
      ...product,
      id: this.products.length + 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.products.push(newProduct);
    this.saveData();
    return newProduct;
  }

  public updateProduct(id: number, product: Partial<Product>): Product | undefined {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    this.products[index] = {
      ...this.products[index],
      ...product,
      updatedAt: Date.now()
    };
    this.saveData();
    return this.products[index];
  }

  public deleteProduct(id: number): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.products.splice(index, 1);
    this.saveData();
    return true;
  }

  // User methods
  public getUsers(): User[] {
    return this.users;
  }

  public getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    console.log('Getting user by email:', email);
    console.log('Available users:', this.users);
    const user = this.users.find(u => u.email === email);
    console.log('Found user:', user);
    return user;
  }

  public createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const newUser: User = {
      ...user,
      id: this.users.length + 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.users.push(newUser);
    this.saveData();
    return newUser;
  }

  public updateUser(id: number, userData: Partial<User>): User | undefined {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return undefined;
    
    this.users[userIndex] = {
      ...this.users[userIndex],
      ...userData,
      updatedAt: Date.now()
    };
    this.saveData();
    return this.users[userIndex];
  }

  public deleteUser(id: number): boolean {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) return false;
    
    this.users.splice(userIndex, 1);
    this.saveData();
    return true;
  }

  // Cart methods
  public getCart(userId: number): Cart | undefined {
    return this.carts.find(c => c.userId === userId);
  }

  public createCart(userId: number): Cart {
    const newCart: Cart = {
      userId,
      items: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.carts.push(newCart);
    this.saveData();
    return newCart;
  }

  public updateCart(userId: number, items: Cart['items']): Cart {
    const cart = this.getCart(userId) || this.createCart(userId);
    cart.items = items;
    cart.updatedAt = Date.now();
    this.saveData();
    return cart;
  }

  // Wishlist methods
  public getWishlist(userId: number): Wishlist | undefined {
    return this.wishlists.find(w => w.userId === userId);
  }

  public createWishlist(userId: number): Wishlist {
    const newWishlist: Wishlist = {
      userId,
      productIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    this.wishlists.push(newWishlist);
    this.saveData();
    return newWishlist;
  }

  public updateWishlist(userId: number, productIds: number[]): Wishlist {
    const wishlist = this.getWishlist(userId) || this.createWishlist(userId);
    wishlist.productIds = productIds;
    wishlist.updatedAt = Date.now();
    this.saveData();
    return wishlist;
  }
} 