import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types';
import { themeApi } from '../services/api';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  theme: Theme;
  isLoading: boolean;
  switchTheme: (school: string) => Promise<void>;
}

const defaultTheme: Theme = {
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

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use a try-catch to handle cases where auth context isn't ready
  let user = null;
  try {
    const authContext = useAuth();
    user = authContext.user;
  } catch (error) {
    // Auth context not ready, use default theme
    console.log('Auth context not ready for theme loading');
  }

  useEffect(() => {
    if (user?.school) {
      loadTheme(user.school);
    }
  }, [user?.school]);

  const loadTheme = async (school: string) => {
    try {
      setIsLoading(true);
      const themeData = await themeApi.getTheme(school);
      setTheme(themeData);
    } catch (error) {
      console.error('Error loading theme:', error);
      setTheme(defaultTheme);
    } finally {
      setIsLoading(false);
    }
  };

  const switchTheme = async (school: string) => {
    await loadTheme(school);
  };

  const value: ThemeContextType = {
    theme,
    isLoading,
    switchTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};