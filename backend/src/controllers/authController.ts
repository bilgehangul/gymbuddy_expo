import { Request, Response } from 'express';
import User from '../models/User';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../types';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, school, gender, birthday, homeGym, motivation, description } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'User already exists with this email' });
      return;
    }

    const age = Math.floor((Date.now() - new Date(birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    const user = new User({
      email,
      password,
      name,
      school,
      gender,
      birthday: new Date(birthday),
      age,
      homeGym,
      motivation,
      description: description || '',
      preferences: {
        ageMin: Math.max(18, age - 5),
        ageMax: Math.min(50, age + 5),
        preferredGender: 'any',
        workoutTypes: ['strength', 'cardio']
      }
    });

    const savedUser = await user.save();
    const { accessToken, refreshToken } = generateTokens((savedUser._id as any).toString(), savedUser.email);

    savedUser.refreshToken = refreshToken;
    await savedUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
        school: savedUser.school
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const { accessToken, refreshToken } = generateTokens((user._id as any).toString(), user.email);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        school: user.school
      },
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(401).json({ error: 'Refresh token required' });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken) as any;
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      res.status(403).json({ error: 'Invalid refresh token' });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      (user._id as any).toString(),
      user.email
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      tokens: {
        accessToken,
        refreshToken: newRefreshToken
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};