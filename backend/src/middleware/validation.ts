import { Request, Response, NextFunction } from 'express';

export const validateRegistration = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password, name, school, gender, birthday, homeGym, motivation } = req.body;

  const errors: string[] = [];

  if (!email || !email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!school) {
    errors.push('School is required');
  }

  if (!['male', 'female', 'other'].includes(gender)) {
    errors.push('Gender must be male, female, or other');
  }

  if (!birthday || isNaN(Date.parse(birthday))) {
    errors.push('Valid birthday is required');
  }

  if (!homeGym) {
    errors.push('Home gym is required');
  }

  if (!motivation) {
    errors.push('Motivation is required');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};

export const validateSession = (req: Request, res: Response, next: NextFunction): void => {
  const { date, time, duration, workoutType, gym } = req.body;

  const errors: string[] = [];

  if (!date || isNaN(Date.parse(date))) {
    errors.push('Valid date is required');
  }

  if (!time || !time.match(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)) {
    errors.push('Valid time in HH:MM format is required');
  }

  if (!duration || duration < 30 || duration > 180) {
    errors.push('Duration must be between 30 and 180 minutes');
  }

  if (!['strength', 'cardio', 'flexibility', 'sports'].includes(workoutType)) {
    errors.push('Workout type must be strength, cardio, flexibility, or sports');
  }

  if (!gym) {
    errors.push('Gym is required');
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
};