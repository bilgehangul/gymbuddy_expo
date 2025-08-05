import { ISession, IUser } from '../types';

export interface MatchCandidate {
  session: ISession;
  user: IUser;
  score: number;
  reasons: string[];
}

export const calculateMatchScore = (
  sessionA: ISession,
  userA: IUser,
  sessionB: ISession,
  userB: IUser
): { score: number; reasons: string[] } => {
  let score = 0;
  const reasons: string[] = [];

  // Time proximity (±30 min): up to 40 points
  const timeA = parseTime(sessionA.time);
  const timeB = parseTime(sessionB.time);
  const timeDifference = Math.abs(timeA - timeB);
  
  if (timeDifference <= 30) {
    const timeScore = Math.round(40 * (1 - timeDifference / 30));
    score += timeScore;
    if (timeScore >= 30) reasons.push('Similar workout times');
  }

  // Age overlap: up to 30 points
  const ageOverlap = calculateAgeOverlap(
    sessionA.preferredAgeMin,
    sessionA.preferredAgeMax,
    sessionB.preferredAgeMin,
    sessionB.preferredAgeMax,
    userA.age,
    userB.age
  );
  
  if (ageOverlap > 0) {
    const ageScore = Math.round(30 * ageOverlap);
    score += ageScore;
    if (ageScore >= 15) reasons.push('Compatible age preferences');
  }

  // Same school bonus: 20 points
  if (userA.school === userB.school) {
    score += 20;
    reasons.push('Same school');
  }

  // Same motivation bonus: 10 points
  if (userA.motivation === userB.motivation) {
    score += 10;
    reasons.push('Similar motivation');
  }

  return { score: Math.min(score, 100), reasons };
};

const parseTime = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

const calculateAgeOverlap = (
  minA: number,
  maxA: number,
  minB: number,
  maxB: number,
  ageA: number,
  ageB: number
): number => {
  // Check if each user falls within the other's preferred age range
  const aInBRange = ageA >= minB && ageA <= maxB;
  const bInARange = ageB >= minA && ageB <= maxA;
  
  if (aInBRange && bInARange) return 1;
  if (aInBRange || bInARange) return 0.5;
  
  // Calculate range overlap
  const overlapMin = Math.max(minA, minB);
  const overlapMax = Math.min(maxA, maxB);
  
  if (overlapMin <= overlapMax) {
    const overlapSize = overlapMax - overlapMin;
    const totalRange = Math.max(maxA - minA, maxB - minB);
    return overlapSize / totalRange;
  }
  
  return 0;
};

export const isGenderCompatible = (
  sessionA: ISession,
  userA: IUser,
  sessionB: ISession,
  userB: IUser
): boolean => {
  const aAcceptsB = sessionA.preferredGender === 'any' || sessionA.preferredGender === userB.gender;
  const bAcceptsA = sessionB.preferredGender === 'any' || sessionB.preferredGender === userA.gender;
  
  return aAcceptsB && bAcceptsA;
};