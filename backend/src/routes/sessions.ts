import express from 'express';
import { 
  createSession, 
  getSessions, 
  getMySessions, 
  updateSession, 
  deleteSession 
} from '../controllers/sessionController';
import { authenticateToken } from '../middleware/auth';
import { validateSession } from '../middleware/validation';

const router = express.Router();

router.get('/', authenticateToken, getSessions);
router.post('/', authenticateToken, validateSession, createSession);
router.get('/my-sessions', authenticateToken, getMySessions);
router.put('/:id', authenticateToken, validateSession, updateSession);
router.delete('/:id', authenticateToken, deleteSession);

export default router;