import { Response } from 'express';
import Message from '../models/Message';
import Match from '../models/Match';
import { AuthRequest } from '../types';

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    const userId = req.user?.userId!;

    const match = await Match.findById(matchId);
    if (!match) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }

    if (match.userA !== userId && match.userB !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    const messages = await Message.find({ matchId })
      .populate('senderId', 'name photoUrl')
      .sort({ timestamp: 1 });

    const unreadMessages = messages.filter(
      msg => !msg.readBy.includes(userId) && (msg.senderId as any)._id.toString() !== userId
    );

    for (const message of unreadMessages) {
      message.readBy.push(userId);
      await message.save();
    }

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { matchId } = req.params;
    const { text, messageType = 'text' } = req.body;
    const userId = req.user?.userId!;

    const match = await Match.findById(matchId);
    if (!match) {
      res.status(404).json({ error: 'Match not found' });
      return;
    }

    if (match.userA !== userId && match.userB !== userId) {
      res.status(403).json({ error: 'Unauthorized' });
      return;
    }

    if (match.status !== 'accepted') {
      res.status(400).json({ error: 'Cannot send messages to unaccepted match' });
      return;
    }

    const message = new Message({
      matchId,
      senderId: userId,
      text,
      messageType,
      readBy: [userId]
    });

    const savedMessage = await message.save();
    await savedMessage.populate('senderId', 'name photoUrl');

    res.status(201).json({
      message: 'Message sent successfully',
      data: savedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};