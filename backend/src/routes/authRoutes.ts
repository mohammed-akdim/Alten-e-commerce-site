import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

router.post('/account', register);
router.post('/token', login);

export default router; 