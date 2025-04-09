import { Router } from 'express';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

// Toutes les routes nécessitent une authentification et des privilèges d'administrateur
router.use(authenticateToken, isAdmin);

// Routes pour la gestion des utilisateurs
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router; 