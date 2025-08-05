import mongoose from 'mongoose';
import User from '../models/User';
import Session from '../models/Session';
import Theme from '../models/Theme';
import Match from '../models/Match';
import Message from '../models/Message';
import { v4 as uuidv4 } from 'uuid';

const schools = [
  {
    school: 'stanford',
    displayName: 'Stanford University',
    colors: {
      primary: '#8C1515',
      secondary: '#B83A4B',
      accent: '#E98300',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#2D2926'
    },
    logos: {
      main: '/assets/stanford-logo-main.png',
      icon: '/assets/stanford-logo-icon.png',
      splash: '/assets/stanford-logo-splash.png'
    },
    fonts: {
      primary: 'Source Sans Pro',
      secondary: 'Source Sans Pro'
    }
  },
  {
    school: 'ucla',
    displayName: 'UCLA',
    colors: {
      primary: '#2774AE',
      secondary: '#FFD100',
      accent: '#003B5C',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#003B5C'
    },
    logos: {
      main: '/assets/ucla-logo-main.png',
      icon: '/assets/ucla-logo-icon.png',
      splash: '/assets/ucla-logo-splash.png'
    },
    fonts: {
      primary: 'Proxima Nova',
      secondary: 'Proxima Nova'
    }
  },
  {
    school: 'berkeley',
    displayName: 'UC Berkeley',
    colors: {
      primary: '#003262',
      secondary: '#FDB515',
      accent: '#C4820E',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#003262'
    },
    logos: {
      main: '/assets/berkeley-logo-main.png',
      icon: '/assets/berkeley-logo-icon.png',
      splash: '/assets/berkeley-logo-splash.png'
    },
    fonts: {
      primary: 'Whitney',
      secondary: 'Whitney'
    }
  },
  {
    school: 'usc',
    displayName: 'USC',
    colors: {
      primary: '#990000',
      secondary: '#FFCC00',
      accent: '#740015',
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#333333'
    },
    logos: {
      main: '/assets/usc-logo-main.png',
      icon: '/assets/usc-logo-icon.png',
      splash: '/assets/usc-logo-splash.png'
    },
    fonts: {
      primary: 'Adobe Garamond Pro',
      secondary: 'Adobe Garamond Pro'
    }
  }
];

const sampleUsers = [
  {
    email: 'alex.chen@stanford.edu',
    password: 'password123',
    name: 'Alex Chen',
    school: 'stanford',
    gender: 'male',
    birthday: new Date('1999-03-15'),
    age: 24,
    homeGym: 'Stanford Fitness Center',
    motivation: 'Build muscle and stay healthy',
    description: 'Computer Science major who loves lifting weights and trying new workout routines.',
    preferences: {
      ageMin: 20,
      ageMax: 28,
      preferredGender: 'any',
      workoutTypes: ['strength', 'sports']
    }
  },
  {
    email: 'sarah.johnson@ucla.edu',
    password: 'password123',
    name: 'Sarah Johnson',
    school: 'ucla',
    gender: 'female',
    birthday: new Date('2000-07-22'),
    age: 23,
    homeGym: 'UCLA Wooden Center',
    motivation: 'Stay fit and relieve stress',
    description: 'Psychology student who enjoys cardio workouts and yoga classes.',
    preferences: {
      ageMin: 21,
      ageMax: 26,
      preferredGender: 'any',
      workoutTypes: ['cardio', 'flexibility']
    }
  },
  {
    email: 'mike.rodriguez@berkeley.edu',
    password: 'password123',
    name: 'Mike Rodriguez',
    school: 'berkeley',
    gender: 'male',
    birthday: new Date('1998-11-08'),
    age: 25,
    homeGym: 'RSF (Recreational Sports Facility)',
    motivation: 'Train for marathons',
    description: 'Engineering student and avid runner preparing for the next big race.',
    preferences: {
      ageMin: 22,
      ageMax: 30,
      preferredGender: 'any',
      workoutTypes: ['cardio', 'sports']
    }
  },
  {
    email: 'emma.davis@usc.edu',
    password: 'password123',
    name: 'Emma Davis',
    school: 'usc',
    gender: 'female',
    birthday: new Date('2001-01-12'),
    age: 22,
    homeGym: 'USC Lyon Center',
    motivation: 'Overall fitness and wellness',
    description: 'Business major who likes mixing different types of workouts.',
    preferences: {
      ageMin: 20,
      ageMax: 25,
      preferredGender: 'any',
      workoutTypes: ['strength', 'flexibility']
    }
  },
  {
    email: 'james.kim@stanford.edu',
    password: 'password123',
    name: 'James Kim',
    school: 'stanford',
    gender: 'male',
    birthday: new Date('1999-09-30'),
    age: 24,
    homeGym: 'Stanford Fitness Center',
    motivation: 'Competitive powerlifting',
    description: 'Mechanical Engineering student focused on strength training.',
    preferences: {
      ageMin: 22,
      ageMax: 28,
      preferredGender: 'male',
      workoutTypes: ['strength']
    }
  },
  {
    email: 'lisa.wang@ucla.edu',
    password: 'password123',
    name: 'Lisa Wang',
    school: 'ucla',
    gender: 'female',
    birthday: new Date('2000-04-18'),
    age: 23,
    homeGym: 'UCLA Wooden Center',
    motivation: 'Dance fitness and flexibility',
    description: 'Pre-med student who loves dance workouts and stretching.',
    preferences: {
      ageMin: 21,
      ageMax: 26,
      preferredGender: 'female',
      workoutTypes: ['flexibility', 'cardio']
    }
  },
  {
    email: 'tom.brown@berkeley.edu',
    password: 'password123',
    name: 'Tom Brown',
    school: 'berkeley',
    gender: 'male',
    birthday: new Date('1997-12-05'),
    age: 26,
    homeGym: 'RSF (Recreational Sports Facility)',
    motivation: 'Rock climbing training',
    description: 'PhD student who trains for outdoor rock climbing adventures.',
    preferences: {
      ageMin: 24,
      ageMax: 30,
      preferredGender: 'any',
      workoutTypes: ['strength', 'sports']
    }
  },
  {
    email: 'sophia.martinez@usc.edu',
    password: 'password123',
    name: 'Sophia Martinez',
    school: 'usc',
    gender: 'female',
    birthday: new Date('2001-06-14'),
    age: 22,
    homeGym: 'USC Lyon Center',
    motivation: 'Tennis training',
    description: 'Communications major and tennis player looking for fitness partners.',
    preferences: {
      ageMin: 20,
      ageMax: 25,
      preferredGender: 'any',
      workoutTypes: ['sports', 'cardio']
    }
  }
];

export const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    await Theme.deleteMany({});
    await User.deleteMany({});
    await Session.deleteMany({});
    await Match.deleteMany({});
    await Message.deleteMany({});

    console.log('Creating themes...');
    const createdThemes = await Theme.insertMany(schools);
    console.log(`Created ${createdThemes.length} themes`);

    console.log('Creating users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    console.log('Creating sample sessions...');
    const sampleSessions = [
      {
        creatorId: (createdUsers[0] as any)._id.toString(),
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        time: '09:00',
        duration: 90,
        workoutType: 'strength',
        preferredAgeMin: 20,
        preferredAgeMax: 30,
        preferredGender: 'any',
        gym: 'Stanford Fitness Center',
        description: 'Looking for a lifting partner for chest and triceps day!',
        status: 'active'
      },
      {
        creatorId: (createdUsers[1] as any)._id.toString(),
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        time: '18:00',
        duration: 60,
        workoutType: 'cardio',
        preferredAgeMin: 21,
        preferredAgeMax: 26,
        preferredGender: 'any',
        gym: 'UCLA Wooden Center',
        description: 'Evening cardio session, let\'s motivate each other!',
        status: 'active'
      },
      {
        creatorId: (createdUsers[2] as any)._id.toString(),
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        time: '07:00',
        duration: 120,
        workoutType: 'cardio',
        preferredAgeMin: 22,
        preferredAgeMax: 30,
        preferredGender: 'any',
        gym: 'RSF (Recreational Sports Facility)',
        description: 'Long morning run around campus, training for marathon.',
        status: 'active'
      },
      {
        creatorId: (createdUsers[4] as any)._id.toString(),
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        time: '10:00',
        duration: 90,
        workoutType: 'strength',
        preferredAgeMin: 22,
        preferredAgeMax: 28,
        preferredGender: 'male',
        gym: 'Stanford Fitness Center',
        description: 'Heavy deadlift and squat session, need a spotter!',
        status: 'active'
      },
      {
        creatorId: (createdUsers[5] as any)._id.toString(),
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        time: '19:30',
        duration: 75,
        workoutType: 'flexibility',
        preferredAgeMin: 21,
        preferredAgeMax: 26,
        preferredGender: 'female',
        gym: 'UCLA Wooden Center',
        description: 'Yoga and stretching session to unwind after studying.',
        status: 'active'
      }
    ];

    const createdSessions = await Session.insertMany(sampleSessions);
    console.log(`Created ${createdSessions.length} sample sessions`);

    console.log('Creating sample matches...');
    const match1 = new Match({
      sessionA: (createdSessions[0] as any)._id.toString(),
      sessionB: (createdSessions[3] as any)._id.toString(),
      userA: (createdUsers[0] as any)._id.toString(),
      userB: (createdUsers[4] as any)._id.toString(),
      score: 85,
      status: 'accepted',
      acceptedBy: [(createdUsers[0] as any)._id.toString(), (createdUsers[4] as any)._id.toString()],
      chatRoomId: uuidv4()
    });

    const match2 = new Match({
      sessionA: (createdSessions[1] as any)._id.toString(),
      sessionB: (createdSessions[4] as any)._id.toString(),
      userA: (createdUsers[1] as any)._id.toString(),
      userB: (createdUsers[5] as any)._id.toString(),
      score: 78,
      status: 'pending',
      acceptedBy: [(createdUsers[1] as any)._id.toString()],
      chatRoomId: uuidv4()
    });

    await match1.save();
    await match2.save();
    console.log('Created 2 sample matches');

    console.log('Creating sample messages...');
    const sampleMessages = [
      {
        matchId: (match1 as any)._id.toString(),
        senderId: (createdUsers[0] as any)._id.toString(),
        text: 'Hey! Excited to work out together tomorrow. What time works best for you?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        readBy: [(createdUsers[0] as any)._id.toString(), (createdUsers[4] as any)._id.toString()]
      },
      {
        matchId: (match1 as any)._id.toString(),
        senderId: (createdUsers[4] as any)._id.toString(),
        text: 'Hi Alex! I\'m free around 10 AM. Is that good for you?',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        readBy: [(createdUsers[0] as any)._id.toString(), (createdUsers[4] as any)._id.toString()]
      },
      {
        matchId: (match1 as any)._id.toString(),
        senderId: (createdUsers[0] as any)._id.toString(),
        text: 'Perfect! See you at the Stanford Fitness Center at 10 AM sharp 💪',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        readBy: [(createdUsers[0] as any)._id.toString()]
      }
    ];

    await Message.insertMany(sampleMessages);
    console.log(`Created ${sampleMessages.length} sample messages`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};