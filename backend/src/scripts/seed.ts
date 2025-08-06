import dotenv from 'dotenv';
import connectDB from '../utils/database';
import { seedDatabase } from '../utils/seedData';

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

runSeed();