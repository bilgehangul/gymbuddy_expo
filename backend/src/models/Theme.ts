import mongoose, { Schema } from 'mongoose';
import { ITheme } from '../types';

const themeSchema = new Schema<ITheme>({
  school: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  colors: {
    primary: {
      type: String,
      required: true
    },
    secondary: {
      type: String,
      required: true
    },
    accent: {
      type: String,
      required: true
    },
    background: {
      type: String,
      required: true
    },
    surface: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  logos: {
    main: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    splash: {
      type: String,
      required: true
    }
  },
  fonts: {
    primary: {
      type: String,
      required: true
    },
    secondary: {
      type: String,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model<ITheme>('Theme', themeSchema);