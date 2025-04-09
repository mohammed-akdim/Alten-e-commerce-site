import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getWishlist);
router.post('/add', authenticateToken, addToWishlist);
router.delete('/:productId', authenticateToken, removeFromWishlist);

export default router; 