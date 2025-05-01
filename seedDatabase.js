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

// Channel data (2 per category: Tech, Game, Songs)
const channels = [
  { channelId: uuidv4(), name: 'TechBit', userId: testUser._id.toString(), description: 'Latest tech tutorials and reviews', category: 'Tech' },
  { channelId: uuidv4(), name: 'CodeMaster', userId: testUser._id.toString(), description: 'In-depth coding guides for tech enthusiasts', category: 'Tech' },
  { channelId: uuidv4(), name: 'GameZone', userId: testUser._id.toString(), description: 'Gaming walkthroughs and tips', category: 'Game' },
  { channelId: uuidv4(), name: 'PixelPlay', userId: testUser._id.toString(), description: 'Esports and gaming reviews', category: 'Game' },
  { channelId: uuidv4(), name: 'MelodyHub', userId: testUser._id.toString(), description: 'Music covers and original songs', category: 'Songs' },
  { channelId: uuidv4(), name: 'TuneVibes', userId: testUser._id.toString(), description: 'Live performances and song tutorials', category: 'Songs' },
];

// Video templates with original YouTube links and filterable keywords
const videoTemplates = [
  // Tech
  {
    title: 'React Tutorial for Tech Beginners',
    description: 'Learn React, a powerful tech framework, from scratch with freeCodeCamp.',
    category: 'Tech',
    videoUrl: 'https://www.youtube.com/embed/Ke90Tje7VS0',
    thumbnailUrl: 'https://img.youtube.com/vi/Ke90Tje7VS0/hqdefault.jpg',
    credit: 'Credit: freeCodeCamp.org (Creative Commons)',
  },
  {
    title: 'Node.js Tech Crash Course',
    description: 'Build a REST API with Express and Node.js tech stack.',
    category: 'Tech',
    videoUrl: 'https://www.youtube.com/embed/fBNz5xF-Kx4',
    thumbnailUrl: 'https://img.youtube.com/vi/fBNz5xF-Kx4/hqdefault.jpg',
    credit: 'Credit: Traversy Media',
  },
  {
    title: 'MongoDB Tech Guide',
    description: 'Quick tech tutorial on MongoDB basics for developers.',
    category: 'Tech',
    videoUrl: 'https://www.youtube.com/embed/EE8ZTpN7XCY',
    thumbnailUrl: 'https://img.youtube.com/vi/EE8ZTpN7XCY/hqdefault.jpg',
    credit: 'Credit: Programming with Mosh',
  },
  {
    title: 'Tech: JavaScript ES6 Features',
    description: 'Explore modern JavaScript tech for web development.',
    category: 'Tech',
    videoUrl: 'https://www.youtube.com/embed/WZQc7RUAg18',
    thumbnailUrl: 'https://img.youtube.com/vi/WZQc7RUAg18/hqdefault.jpg',
    credit: 'Credit: The Net Ninja',
  },
  // Game
  {
    title: 'Minecraft Gaming Survival Guide',
    description: 'Gaming tips for surviving in Minecraft’s open world.',
    category: 'Game',
    videoUrl: 'https://www.youtube.com/embed/0MhJMYMg5Kg',
    thumbnailUrl: 'https://img.youtube.com/vi/0MhJMYMg5Kg/hqdefault.jpg',
    credit: 'Credit: Pixlriffs (Fair use for gameplay)',
  },
  {
    title: 'Zelda Gaming Pro Tips',
    description: 'Master Hyrule with these gaming strategies for Breath of the Wild.',
    category: 'Game',
    videoUrl: 'https://www.youtube.com/embed/zw47_q9wbBE',
    thumbnailUrl: 'https://img.youtube.com/vi/zw47_q9wbBE/hqdefault.jpg',
    credit: 'Credit: Austin John Plays',
  },
  {
    title: 'Indie Gaming Showcase',
    description: 'Discover the best indie games in this gaming roundup.',
    category: 'Game',
    videoUrl: 'https://www.youtube.com/embed/5o8CkG4ZWDc',
    thumbnailUrl: 'https://img.youtube.com/vi/5o8CkG4ZWDc/hqdefault.jpg',
    credit: 'Credit: Game Maker’s Toolkit',
  },
  {
    title: 'Fortnite Gaming Strategies',
    description: 'Improve your Fortnite game with these gaming tips.',
    category: 'Game',
    videoUrl: 'https://www.youtube.com/embed/9g4h7Z_7g0E',
    thumbnailUrl: 'https://img.youtube.com/vi/9g4h7Z_7g0E/hqdefault.jpg',
    credit: 'Credit: SypherPK',
  },
  // Songs
  {
    title: 'Chill Lo-Fi Songs',
    description: 'Relax with royalty-free lo-fi songs for studying.',
    category: 'Songs',
    videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    thumbnailUrl: 'https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg',
    credit: 'Credit: Lofi Girl (YouTube Audio Library)',
  },
  {
    title: 'Zelda Theme: Acoustic Songs',
    description: 'GameChops acoustic songs cover of Zelda’s theme.',
    category: 'Songs',
    videoUrl: 'https://www.youtube.com/embed/6zV7ZwyxQeQ',
    thumbnailUrl: 'https://img.youtube.com/vi/6zV7ZwyxQeQ/hqdefault.jpg',
    credit: 'Credit: GameChops (Creative Commons)',
  },
  {
    title: 'Piano Songs Tutorial',
    description: 'Learn popular songs on piano with this tutorial.',
    category: 'Songs',
    videoUrl: 'https://www.youtube.com/embed/2Vv-BfVoq4g',
    thumbnailUrl: 'https://img.youtube.com/vi/2Vv-BfVoq4g/hqdefault.jpg',
    credit: 'Credit: Rousseau',
  },
  {
    title: 'Original Pop Songs',
    description: 'Enjoy our latest original pop songs performance.',
    category: 'Songs',
    videoUrl: 'https://www.youtube.com/embed/8xg3vE8Ie_E',
    thumbnailUrl: 'https://img.youtube.com/vi/8xg3vE8Ie_E/hqdefault.jpg',
    credit: 'Credit: Taryn Southern',
  },
];

// Generate 40 videos
const generateVideos = () => {
  const videos = [];
  let TECH = 0, GAME = 0, SONGS = 0;
  const categoryCounts = { Tech: 0, Game: 0, Songs: 0 };
  const minVideosPerCategory = 13;

  // Helper to get random template by category
  const getRandomTemplate = (category) => {
    const categoryTemplates = videoTemplates.filter((t) => t.category === category);
    return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
  };

  // Assign videos to channels
  channels.forEach((channel) => {
    const videosPerChannel = Math.floor(Math.random() * 8) + 5; // 5-12 videos per channel
    for (let i = 0; i < videosPerChannel && videos.length < 40; i++) {
      const category = channel.category;
      if (categoryCounts[category] < minVideosPerCategory || (videos.length >= 39 && categoryCounts[category] < minVideosPerCategory + 1)) {
        const template = getRandomTemplate(category);
        const videoCount = category === 'Tech' ? ++TECH : category === 'Game' ? ++GAME : ++SONGS;
        videos.push({
          videoId: uuidv4(),
          title: `${template.title} #${videoCount}`,
          thumbnailUrl: template.thumbnailUrl,
          videoUrl: template.videoUrl,
          description: template.description,
          channelId: channel.channelId,
          uploader: testUser.username,
          userId: testUser._id.toString(),
          views: Math.floor(Math.random() * 50000) + 100,
          likes: Array.from({ length: Math.floor(Math.random() * 50) }, () => uuidv4()),
          dislikes: Array.from({ length: Math.floor(Math.random() * 20) }, () => uuidv4()),
          uploadDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
          comments: [
            {
              commentId: uuidv4(),
              userId: testUser._id.toString(),
              text: `Amazing ${category} content! Keep it up!`,
              timestamp: new Date(),
            },
            {
              commentId: uuidv4(),
              userId: testUser._id.toString(),
              text: `Loved this ${template.title.split(' ')[0]} video!`,
              timestamp: new Date(),
            },
          ],
          category,
          credit: template.credit,
        });
        categoryCounts[category]++;
      }
    }
  });

  // Fill remaining videos randomly
  while (videos.length < 40) {
    const category = ['Tech', 'Game', 'Songs'][Math.floor(Math.random() * 3)];
    const template = getRandomTemplate(category);
    const videoCount = category === 'Tech' ? ++TECH : category === 'Game' ? ++GAME : ++SONGS;
    const channel = channels.find((c) => c.category === category);
    videos.push({
      videoId: uuidv4(),
      title: `${template.title} #${videoCount}`,
      thumbnailUrl: template.thumbnailUrl,
      videoUrl: template.videoUrl,
      description: template.description,
      channelId: channel.channelId,
      uploader: testUser.username,
      userId: testUser._id.toString(),
      views: Math.floor(Math.random() * 50000) + 100,
      likes: Array.from({ length: Math.floor(Math.random() * 50) }, () => uuidv4()),
      dislikes: Array.from({ length: Math.floor(Math.random() * 20) }, () => uuidv4()),
      uploadDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
      comments: [
        {
          commentId: uuidv4(),
          userId: testUser._id.toString(),
          text: `Great ${category} video!`,
          timestamp: new Date(),
        },
      ],
      category,
      credit: template.credit,
    });
    categoryCounts[category]++;
  }

  return videos;
};

// Seed database
const seedDatabase = async () => {
  try {
    // Validate environment variable
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not defined in .env');
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('MongoDB Atlas connected');

    // Clear collections
    await Promise.all([
      User.deleteMany({}).then(() => console.log('Cleared users')),
      Channel.deleteMany({}).then(() => console.log('Cleared channels')),
      Video.deleteMany({}).then(() => console.log('Cleared videos')),
    ]);

    // Seed user
    const user = await User.create(testUser);
    console.log('Seeded test user:', user.email);

    // Seed channels
    const seededChannels = await Channel.insertMany(channels);
    console.log('Seeded channels:', seededChannels.map(c => c.name));

    // Seed videos
    const videos = generateVideos();
    const seededVideos = await Video.insertMany(videos);
    console.log('Seeded videos:', seededVideos.length);

    // Verify counts
    const [userCount, channelCount, videoCount] = await Promise.all([
      User.countDocuments(),
      Channel.countDocuments(),
      Video.countDocuments(),
    ]);
    console.log(`Total users: ${userCount}`);
    console.log(`Total channels: ${channelCount}`);
    console.log(`Total videos: ${videoCount}`);

    // Log category distribution
    const categoryCounts = videos.reduce((acc, v) => {
      acc[v.category] = (acc[v.category] || 0) + 1;
      return acc;
    }, {});
    console.log('Video category distribution:', categoryCounts);
  } catch (error) {
    console.error('Seeding error:', error.message);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the seeding script
seedDatabase().catch((err) => {
  console.error('Seed script failed:', err.message);
  process.exit(1);
});