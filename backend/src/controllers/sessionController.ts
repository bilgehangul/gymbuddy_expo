import { Response } from 'express';
import Session from '../models/Session';
import User from '../models/User';
import { AuthRequest } from '../types';
import { calculateMatchScore, isGenderCompatible } from '../utils/matching';

export const createSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessionData = {
      ...req.body,
      creatorId: req.user?.userId,
      date: new Date(req.body.date)
    };

    const session = new Session(sessionData);
    const savedSession = await session.save();

    res.status(201).json({
      message: 'Session created successfully',
      session: savedSession
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUser = await User.findById(req.user?.userId);
    if (!currentUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const userSessions = await Session.find({
      creatorId: req.user?.userId,
      status: 'active'
    }).sort({ date: 1, time: 1 });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const potentialMatches = await Session.find({
      creatorId: { $ne: req.user?.userId },
      status: 'active',
      date: { $gte: today }
    }).populate('creatorId', '-password -refreshToken');

    const matches = [];

    for (const userSession of userSessions) {
      const sessionMatches = [];

      for (const candidateSession of potentialMatches) {
        const candidateUser = candidateSession.creatorId as any;

        if (
          userSession.date.toDateString() === candidateSession.date.toDateString() &&
          userSession.workoutType === candidateSession.workoutType &&
          isGenderCompatible(userSession, currentUser, candidateSession, candidateUser)
        ) {
          const { score, reasons } = calculateMatchScore(
            userSession,
            currentUser,
            candidateSession,
            candidateUser
          );

          if (score >= 30) {
            sessionMatches.push({
              session: candidateSession,
              user: candidateUser,
              score,
              reasons,
              userSession: userSession._id
            });
          }
        }
      }

      sessionMatches.sort((a, b) => b.score - a.score);
      matches.push(...sessionMatches.slice(0, 10));
    }

    matches.sort((a, b) => b.score - a.score);

    res.json({
      userSessions,
      potentialMatches: matches.slice(0, 20)
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMySessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessions = await Session.find({
      creatorId: req.user?.userId
    }).sort({ date: -1, time: -1 });

    res.json({ sessions });
  } catch (error) {
    console.error('Get my sessions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const session = await Session.findOne({
      _id: id,
      creatorId: req.user?.userId
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found or unauthorized' });
      return;
    }

    const allowedUpdates = [
      'date', 'time', 'duration', 'workoutType', 'preferredAgeMin', 
      'preferredAgeMax', 'preferredGender', 'gym', 'description'
    ];

    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        if (key === 'date') {
          session[key] = new Date(updates[key]);
        } else {
          (session as any)[key] = updates[key];
        }
      }
    });

    const updatedSession = await session.save();

    res.json({
      message: 'Session updated successfully',
      session: updatedSession
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const session = await Session.findOneAndUpdate(
      {
        _id: id,
        creatorId: req.user?.userId
      },
      { status: 'cancelled' },
      { new: true }
    );

    if (!session) {
      res.status(404).json({ error: 'Session not found or unauthorized' });
      return;
    }

    res.json({
      message: 'Session cancelled successfully',
      session
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};