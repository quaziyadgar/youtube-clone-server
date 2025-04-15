import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Video from './models/Video.js';
import Channel from './models/Channel.js';

dotenv.config();

const videos = [
  {
    videoId: 'vid-001',
    title: 'React Tutorial for Beginners',
    thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f1348f5f2509',
    description: 'Learn the basics of React.js with this beginner-friendly tutorial.',
    channelId: 'channel-tech',
    uploader: 'user1',
    views: 1500,
    likes: 120,
    dislikes: 5,
    uploadDate: new Date('2025-03-01T10:00:00Z'),
    comments: [
      {
        commentId: 'cmt-001',
        userId: 'user2',
        text: 'Great tutorial! Helped me understand hooks.',
        timestamp: new Date('2025-03-02T12:00:00Z'),
      },
      {
        commentId: 'cmt-002',
        userId: 'user3',
        text: 'Can you cover Redux next?',
        timestamp: new Date('2025-03-02T14:00:00Z'),
      },
    ],
  },
  {
    videoId: 'vid-002',
    title: 'Gaming Highlights: CyberQuest',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e',
    description: 'Epic moments from the latest CyberQuest tournament.',
    channelId: 'channel-gaming',
    uploader: 'user2',
    views: 3200,
    likes: 200,
    dislikes: 10,
    uploadDate: new Date('2025-03-05T15:00:00Z'),
    comments: [
      {
        commentId: 'cmt-003',
        userId: 'user1',
        text: 'That final play was insane!',
        timestamp: new Date('2025-03-06T09:00:00Z'),
      },
    ],
  },
  {
    videoId: 'vid-003',
    title: 'Tech News: AI Breakthroughs',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321310764-8d7c34474c4b',
    description: 'Latest advancements in artificial intelligence.',
    channelId: 'channel-tech',
    uploader: 'user1',
    views: 800,
    likes: 50,
    dislikes: 2,
    uploadDate: new Date('2025-03-10T08:00:00Z'),
    comments: [],
  },
  {
    videoId: 'vid-004',
    title: 'DIY Home Decor Ideas',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-b0b7e3e1b1f3',
    description: 'Creative and budget-friendly decor tips for your home.',
    channelId: 'channel-lifestyle',
    uploader: 'user3',
    views: 500,
    likes: 30,
    dislikes: 1,
    uploadDate: new Date('2025-03-12T11:00:00Z'),
    comments: [
      {
        commentId: 'cmt-004',
        userId: 'user2',
        text: 'Love the minimalist vibe!',
        timestamp: new Date('2025-03-12T13:00:00Z'),
      },
    ],
  },
];

const channels = [
  {
    channelId: 'channel-tech',
    name: 'TechBit',
    owner: 'user1',
    videos: [],
  },
  {
    channelId: 'channel-gaming',
    name: 'GameZone',
    owner: 'user2',
    videos: [],
  },
  {
    channelId: 'channel-lifestyle',
    name: 'LifeVibes',
    owner: 'user3',
    videos: [],
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    await Video.deleteMany({});
    await Channel.deleteMany({});
    console.log('Cleared existing data');

    // Insert videos
    const insertedVideos = await Video.insertMany(videos);
    console.log('Inserted videos:', insertedVideos.length);

    // Map videos to channels
    const channelVideoMap = {};
    insertedVideos.forEach((video) => {
      if (!channelVideoMap[video.channelId]) {
        channelVideoMap[video.channelId] = [];
      }
      channelVideoMap[video.channelId].push(video._id);
    });

    // Update channels with video references
    const updatedChannels = channels.map((channel) => ({
      ...channel,
      videos: channelVideoMap[channel.channelId] || [],
    }));

    // Insert channels
    await Channel.insertMany(updatedChannels);
    console.log('Inserted channels:', updatedChannels.length);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();