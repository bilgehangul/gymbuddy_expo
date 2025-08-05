import { Response } from 'express';
import Match from '../models/Match';
import Session from '../models/Session';
import User from '../models/User';
import { AuthRequest } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const getMatches = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const matches = await Match.find({
      $or: [
        { userA: req.user?.userId },
        { userB: req.user?.userId }
      ],
      status: { $in: ['pending', 'accepted'] },
      expiresAt: { $gt: new Date() }
    })
    .populate('sessionA sessionB userA userB', '-password -refreshToken')
    .sort({ createdAt: -1 });

    res.json({ matches });
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const acceptMatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId!;

    const match = await Match.findById(id);
    if (!match) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }

    if (match.userA !== userId && match.userB !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    if (match.status === 'expired' || match.expiresAt < new Date()) {
      res.status(400).json({ error: 'Match has expired' });
      return;
    }

    if (!match.acceptedBy.includes(userId)) {
      match.acceptedBy.push(userId);
    }

    if (match.acceptedBy.length === 2) {
      match.status = 'accepted';
      
      await Session.findByIdAndUpdate(match.sessionA, { status: 'matched' });
      await Session.findByIdAndUpdate(match.sessionB, { status: 'matched' });
    }

    const updatedMatch = await match.save();
    await updatedMatch.populate('sessionA sessionB userA userB', '-password -refreshToken');

    res.json({
      message: 'Match accepted successfully',
      match: updatedMatch
    });
  } catch (error) {
    console.error('Accept match error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const declineMatch = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId!;

    const match = await Match.findById(id);
    if (!match) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }

    if (match.userA !== userId && match.userB !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    match.status = 'declined';
    const updatedMatch = await match.save();

    res.json({
      message: 'Match declined successfully',
      match: updatedMatch
    });
  } catch (error) {
    console.error('Decline match error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createMatch = async (
  sessionAId: string,
  sessionBId: string,
  userAId: string,
  userBId: string,
  score: number
): Promise<void> => {
  try {
    const existingMatch = await Match.findOne({
      $or: [
        { sessionA: sessionAId, sessionB: sessionBId },
        { sessionA: sessionBId, sessionB: sessionAId }
      ],
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingMatch) {
      return;
    }

    const match = new Match({
      sessionA: sessionAId,
      sessionB: sessionBId,
      userA: userAId,
      userB: userBId,
      score,
      chatRoomId: uuidv4()
    });

    await match.save();
  } catch (error) {
    console.error('Create match error:', error);
  }
};