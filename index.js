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
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  console.log(`${req.method} ${req.url} from ${req.headers.origin}`);
  next();
});

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