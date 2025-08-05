import express from 'express';
import { register, login, refresh, logout } from '../controllers/authController';
import { validateRegistration } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', authenticateToken, logout);

export default router;