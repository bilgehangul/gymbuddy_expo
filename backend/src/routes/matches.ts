import express from 'express';
import { getMatches, acceptMatch, declineMatch } from '../controllers/matchController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.get('/', authenticateToken, getMatches);
router.post('/:id/accept', authenticateToken, acceptMatch);
router.post('/:id/decline', authenticateToken, declineMatch);

export default router;