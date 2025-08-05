import mongoose, { Schema } from 'mongoose';
import { ISession } from '../types';

const sessionSchema = new Schema<ISession>({
  creatorId: {
    type: String,
    required: true,
    ref: 'User'
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 30,
    max: 180
  },
  workoutType: {
    type: String,
    enum: ['strength', 'cardio', 'flexibility', 'sports'],
    required: true
  },
  preferredAgeMin: {
    type: Number,
    default: 18,
    min: 18
  },
  preferredAgeMax: {
    type: Number,
    default: 30,
    max: 100
  },
  preferredGender: {
    type: String,
    enum: ['male', 'female', 'any'],
    default: 'any'
  },
  gym: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  status: {
    type: String,
    enum: ['active', 'matched', 'completed', 'cancelled'],
    default: 'active'
  },
  maxParticipants: {
    type: Number,
    default: 2,
    min: 2,
    max: 10
  }
}, {
  timestamps: true
});

sessionSchema.index({ date: 1, workoutType: 1, status: 1 });
sessionSchema.index({ creatorId: 1, status: 1 });

export default mongoose.model<ISession>('Session', sessionSchema);