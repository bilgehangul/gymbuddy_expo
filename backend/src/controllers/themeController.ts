import { Request, Response } from 'express';
import Theme from '../models/Theme';

export const getTheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const { school } = req.params;

    const theme = await Theme.findOne({ school, isActive: true });
    
    if (!theme) {
      const defaultTheme = {
        school: 'default',
        displayName: 'Default',
        colors: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#06b6d4',
          background: '#ffffff',
          surface: '#f8fafc',
          text: '#1e293b'
        },
        logos: {
          main: '/assets/logo-main.png',
          icon: '/assets/logo-icon.png',
          splash: '/assets/logo-splash.png'
        },
        fonts: {
          primary: 'Inter',
          secondary: 'Inter'
        }
      };
      
      res.json({ theme: defaultTheme });
      return;
    }

    res.json({ theme });
  } catch (error) {
    console.error('Get theme error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllThemes = async (req: Request, res: Response): Promise<void> => {
  try {
    const themes = await Theme.find({ isActive: true })
      .select('school displayName colors')
      .sort({ displayName: 1 });

    res.json({ themes });
  } catch (error) {
    console.error('Get all themes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};