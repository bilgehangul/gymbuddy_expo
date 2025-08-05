import mongoose, { Schema } from 'mongoose';
import { IMessage } from '../types';

const messageSchema = new Schema<IMessage>({
  matchId: {
    type: String,
    required: true,
    ref: 'Match'
  },
  senderId: {
    type: String,
    required: true,
    ref: 'User'
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'system'],
    default: 'text'
  },
  readBy: [{
    type: String,
    ref: 'User'
  }]
}, {
  timestamps: true
});

messageSchema.index({ matchId: 1, timestamp: -1 });
messageSchema.index({ senderId: 1, timestamp: -1 });

export default mongoose.model<IMessage>('Message', messageSchema);