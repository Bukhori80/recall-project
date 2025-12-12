import mongoose from 'mongoose';
import { mongoUri } from './index.js';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully.');
    console.log('Connected to database:', mongoose.connection.name);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;