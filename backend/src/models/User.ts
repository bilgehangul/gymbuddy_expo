import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../types';

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  school: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  birthday: {
    type: Date,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  homeGym: {
    type: String,
    required: true
  },
  motivation: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  photoUrl: {
    type: String
  },
  preferences: {
    ageMin: {
      type: Number,
      default: 18
    },
    ageMax: {
      type: Number,
      default: 30
    },
    preferredGender: {
      type: String,
      enum: ['male', 'female', 'any'],
      default: 'any'
    },
    workoutTypes: [{
      type: String,
      enum: ['strength', 'cardio', 'flexibility', 'sports']
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  refreshToken: {
    type: String
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);