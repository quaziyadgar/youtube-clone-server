import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import videoRoutes from './routes/videos.js';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));