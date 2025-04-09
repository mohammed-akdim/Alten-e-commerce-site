import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { sendContactMessage } from '../controllers/contactController';

const router = Router();

router.post('/', authenticateToken, sendContactMessage);

export default router; 