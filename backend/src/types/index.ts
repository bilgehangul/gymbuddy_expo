import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  school: string;
  gender: 'male' | 'female' | 'other';
  birthday: Date;
  age: number;
  homeGym: string;
  motivation: string;
  description: string;
  photoUrl?: string;
  preferences: {
    ageMin: number;
    ageMax: number;
    preferredGender: 'male' | 'female' | 'any';
    workoutTypes: string[];
  };
  isActive: boolean;
  refreshToken?: string;
  comparePassword(password: string): Promise<boolean>;
}

export interface ISession extends Document {
  creatorId: string;
  date: Date;
  time: string;
  duration: number;
  workoutType: string;
  preferredAgeMin: number;
  preferredAgeMax: number;
  preferredGender: 'male' | 'female' | 'any';
  gym: string;
  description: string;
  status: 'active' | 'matched' | 'completed' | 'cancelled';
  maxParticipants: number;
}

export interface IMatch extends Document {
  sessionA: string;
  sessionB: string;
  userA: string;
  userB: string;
  score: number;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  acceptedBy: string[];
  expiresAt: Date;
  chatRoomId: string;
}

export interface IMessage extends Document {
  matchId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  messageType: 'text' | 'image' | 'system';
  readBy: string[];
}

export interface ITheme extends Document {
  school: string;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  logos: {
    main: string;
    icon: string;
    splash: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  isActive: boolean;
}

import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}