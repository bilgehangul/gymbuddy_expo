import mongoose, { Schema } from 'mongoose';
import { IMatch } from '../types';

const matchSchema = new Schema<IMatch>({
  sessionA: {
    type: String,
    required: true,
    ref: 'Session'
  },
  sessionB: {
    type: String,
    required: true,
    ref: 'Session'
  },
  userA: {
    type: String,
    required: true,
    ref: 'User'
  },
  userB: {
    type: String,
    required: true,
    ref: 'User'
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'declined', 'expired'],
    default: 'pending'
  },
  acceptedBy: [{
    type: String,
    ref: 'User'
  }],
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  },
  chatRoomId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

matchSchema.index({ userA: 1, status: 1 });
matchSchema.index({ userB: 1, status: 1 });
matchSchema.index({ expiresAt: 1 });

export default mongoose.model<IMatch>('Match', matchSchema);