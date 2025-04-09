import { Router } from 'express';
import { getCart, updateCart, addToCart, removeFromCart } from '../controllers/cartController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, getCart);
router.put('/', authenticateToken, updateCart);
router.post('/add', authenticateToken, addToCart);
router.delete('/:productId', authenticateToken, removeFromCart);

export default router; 