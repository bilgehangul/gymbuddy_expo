import express from 'express';
import { getTheme, getAllThemes } from '../controllers/themeController';

const router = express.Router();

router.get('/', getAllThemes);
router.get('/:school', getTheme);

export default router;