import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import Video from './models/Video.js';
import Channel from './models/Channel.js';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Test user
const testUser = {
  _id: new mongoose.Types.ObjectId(),
  email: 'test@example.com',
  password: bcrypt.hashSync('password123', 10),
  username: 'testuser',
};

// Channel data
const channels = [
  { channelId: uuidv4(), name: 'TechBit', userId: testUser._id.toString(), description: 'Tech tutorials' },
  { channelId: uuidv4(), name: 'CodeMaster', userId: testUser._id.toString(), description: 'Coding guides' },
  { channelId: uuidv4(), name: 'VlogVibes', userId: testUser._id.toString(), description: 'Daily vlogs' },
];

// Video templates
const videoTemplates = [
  { title: 'React Hooks Tutorial', description: 'Learn React Hooks in 10 minutes!', category: 'Tech', videoUrl: 'https://example.com/videos/react-hooks.mp4' },
  { title: 'Node.js Crash Course', description: 'Build a REST API with Express.', category: 'Tech', videoUrl: 'https://example.com/videos/nodejs-api.mp4' },
  { title: 'Morning Routine Vlog', description: 'Start your day with me!', category: 'Vlog', videoUrl: 'https://example.com/videos/morning-vlog.mp4' },
];

// Generate 30 videos
const generateVideos = () => {
  const videos = [];
  let videoCount = 0;

  channels.forEach((channel) => {
    const videosPerChannel = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < videosPerChannel && videoCount < 30; i++) {
      const template = videoTemplates[Math.floor(Math.random() * videoTemplates.length)];
      videos.push({
        videoId: uuidv4(),
        title: `${template.title} ${videoCount + 1}`,
        thumbnailUrl: `https://example.com/thumbnails/${uuidv4()}.jpg`,
        videoUrl: template.videoUrl,
        description: template.description,
        channelId: channel.channelId,
        uploader: testUser.username,
        userId: testUser._id.toString(),
        views: Math.floor(Math.random() * 10000),
        likes: [],
        dislikes: [],
        uploadDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        comments: [
          {
            commentId: uuidv4(),
            userId: testUser._id.toString(),
            text: `Great ${template.category} video!`,
            timestamp: new Date(),
          },
        ],
      });
      videoCount++;
    }
  });

  return videos;
};

// Seed database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas connected');

    // Clear collections
    await User.deleteMany({});
    console.log('Cleared users');
    await Channel.deleteMany({});
    console.log('Cleared channels');
    await Video.deleteMany({});
    console.log('Cleared videos');

    // Seed user
    await User.create(testUser);
    console.log('Seeded test user:', testUser.email);

    // Seed channels
    await Channel.insertMany(channels);
    console.log('Seeded 3 channels:', channels.map(c => c.name));

    // Seed videos
    const videos = generateVideos();
    await Video.insertMany(videos);
    console.log('Seeded 30 videos:', videos.length);

    // Verify counts
    const userCount = await User.countDocuments();
    const channelCount = await Channel.countDocuments();
    const videoCount = await Video.countDocuments();
    console.log(`Total users: ${userCount}`);
    console.log(`Total channels: ${channelCount}`);
    console.log(`Total videos: ${videoCount}`);
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the seeding script
seedDatabase();