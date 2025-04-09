import { Request, Response } from 'express';
import { DataService } from '../services/dataService';
import { AuthRequest } from '../middleware/auth';

const dataService = DataService.getInstance();

export const getWishlist = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const wishlist = dataService.getWishlist(userId);
    
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};

export const addToWishlist = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    
    const wishlist = dataService.getWishlist(userId) || dataService.createWishlist(userId);
    
    if (!wishlist.productIds.includes(productId)) {
      wishlist.productIds.push(productId);
      const updatedWishlist = dataService.updateWishlist(userId, wishlist.productIds);
      res.json(updatedWishlist);
    } else {
      res.json(wishlist);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
};

export const removeFromWishlist = (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId } = req.params;
    
    const wishlist = dataService.getWishlist(userId);
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    wishlist.productIds = wishlist.productIds.filter(id => id !== parseInt(productId));
    const updatedWishlist = dataService.updateWishlist(userId, wishlist.productIds);
    res.json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
}; 