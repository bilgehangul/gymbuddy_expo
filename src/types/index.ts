export interface User {
  id: string;
  email: string;
  name: string;
  school: string;
  gender: 'male' | 'female' | 'other';
  birthday: string;
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
}

export interface Session {
  _id: string;
  creatorId: string;
  date: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  _id: string;
  sessionA: Session;
  sessionB: Session;
  userA: User;
  userB: User;
  score: number;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  acceptedBy: string[];
  expiresAt: string;
  chatRoomId: string;
  createdAt: string;
}

export interface Message {
  _id: string;
  matchId: string;
  senderId: string;
  text: string;
  timestamp: string;
  messageType: 'text' | 'image' | 'system';
  readBy: string[];
  createdAt: string;
}

export interface Theme {
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
}

export interface MatchCandidate {
  session: Session;
  user: User;
  score: number;
  reasons: string[];
  userSession: string;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
  errors?: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  tokens: AuthTokens;
}