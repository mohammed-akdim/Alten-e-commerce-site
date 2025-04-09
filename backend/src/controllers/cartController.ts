import { Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { AuthRequest } from '../middleware/auth';
import { CartItem } from '../models/Cart';

const dataService = DataService.getInstance();

export const getCart = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const cart = dataService.getCart(userId);
    res.json(cart || { items: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

export const updateCart = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const items: CartItem[] = req.body.items;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Invalid cart items format' });
    }
    
    const cart = dataService.updateCart(userId, items);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart' });
  }
};

export const addToCart = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const cart = dataService.getCart(userId) || dataService.createCart(userId);
    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    dataService.updateCart(userId, cart.items);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

export const updateCartItem = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({ message: 'Quantity is required' });
    }

    const cart = dataService.getCart(userId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === parseInt(productId));
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    dataService.updateCart(userId, cart.items);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item' });
  }
};

export const removeFromCart = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { productId } = req.params;
    const cart = dataService.getCart(userId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId === parseInt(productId));
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items.splice(itemIndex, 1);
    dataService.updateCart(userId, cart.items);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart' });
  }
};

export const clearCart = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const cart = dataService.getCart(userId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    dataService.updateCart(userId, cart.items);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart' });
  }
}; 