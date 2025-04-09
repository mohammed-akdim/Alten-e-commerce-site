import { Router } from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, searchProducts } from '../controllers/productController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Protected routes
router.post('/', authenticateToken, isAdmin, createProduct);
router.put('/:id', authenticateToken, isAdmin, updateProduct);
router.delete('/:id', authenticateToken, isAdmin, deleteProduct);

export default router; 