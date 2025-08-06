import { Request, Response } from 'express';
import User from '../models/User';
import Theme from '../models/Theme';
import { AuthRequest } from '../types';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select('-password -refreshToken');
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updates = req.body;
    const allowedUpdates = [
      'name', 'homeGym', 'motivation', 'description', 'preferences'
    ];

    const updateData: any = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = updates[key];
      }
    });

    if (updates.birthday) {
      updateData.birthday = new Date(updates.birthday);
      updateData.age = Math.floor(
        (Date.now() - new Date(updates.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
      );
    }

    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const uploadPhoto = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const photoUrl = `/uploads/${req.file.filename}`;
    
    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { photoUrl },
      { new: true }
    ).select('-password -refreshToken');

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ 
      message: 'Photo uploaded successfully',
      photoUrl,
      user
    });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSchools = async (req: Request, res: Response): Promise<void> => {
  try {
    const schools = await Theme.find({ isActive: true })
      .select('school displayName')
      .sort({ displayName: 1 });

    res.json({ schools });
  } catch (error) {
    console.error('Get schools error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};