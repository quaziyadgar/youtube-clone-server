import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import videoRoutes from './routes/videos.js';
import authRoutes from './routes/auth.js';
import channelRoutes from './routes/channels.js';
import dotenv from 'dotenv';
import { initGridFS } from './utils/gridfs.js';

dotenv.config();

const app = express();

// app.options('*', cors());
const allowedOrigins = [
  'http://localhost:5173',
  'https://youtube-clone-bice-pi.vercel.app', // No trailing slash
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/channels', channelRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {console.log('MongoDB Atlas connected'); initGridFS()})
  .catch((err) => console.error('MongoDB connection error:', err));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
export default app;