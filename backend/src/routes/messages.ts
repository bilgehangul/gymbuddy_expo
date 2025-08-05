import express from 'express';
import { getMessages, sendMessage } from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/:matchId', authenticateToken, getMessages);
router.post('/:matchId', authenticateToken, sendMessage);

export default router;