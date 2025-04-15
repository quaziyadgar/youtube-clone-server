import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import Video from './models/Video.js';
import Channel from './models/Channel.js';
import dotenv from 'dotenv';

dotenv.config();

const channels = [
  { channelId: uuidv4(), name: 'TechBit', owner: 'user1' },
  { channelId: uuidv4(), name: 'CodeMaster', owner: 'user2' },
  { channelId: uuidv4(), name: 'VlogVibes', owner: 'user3' },
  { channelId: uuidv4(), name: 'GamingGuru', owner: 'user4' },
  { channelId: uuidv4(), name: 'MusicMoods', owner: 'user5' },
  { channelId: uuidv4(), name: 'DIYDreams', owner: 'user6' },
  { channelId: uuidv4(), name: 'TravelTales', owner: 'user7' },
  { channelId: uuidv4(), name: 'FoodieFiesta', owner: 'user8' },
  { channelId: uuidv4(), name: 'FitnessFreak', owner: 'user9' },
  { channelId: uuidv4(), name: 'ArtAttack', owner: 'user10' },
  { channelId: uuidv4(), name: 'ScienceScope', owner: 'user11' },
  { channelId: uuidv4(), name: 'HistoryHub', owner: 'user12' },
  { channelId: uuidv4(), name: 'NatureNexus', owner: 'user13' },
  { channelId: uuidv4(), name: 'ComedyCentral', owner: 'user14' },
  { channelId: uuidv4(), name: 'LifeLessons', owner: 'user15' },
];

const videoTemplates = [
  { title: 'React Hooks Tutorial', description: 'Learn React Hooks in 10 minutes!', category: 'Tech', urlId: 'dQw4w9WgXcQ' },
  { title: 'Node.js Crash Course', description: 'Build a REST API with Express.', category: 'Tech', urlId: 'k_2Zzv7sE5A' },
  { title: 'Morning Routine Vlog', description: 'Start your day with me!', category: 'Vlog', urlId: 'a1b2c3d4e5f6' },
  { title: 'Epic Gaming Montage', description: 'Best moments from my streams.', category: 'Gaming', urlId: 'g7h8i9j0k1l2' },
  { title: 'Guitar Cover - Pop Hits', description: 'Acoustic covers of your favorites.', category: 'Music', urlId: 'm3n4o5p6q7r8' },
  { title: 'DIY Home Decor', description: 'Make your space cozy on a budget.', category: 'DIY', urlId: 's9t0u1v2w3x4' },
  { title: 'Paris Travel Guide', description: 'Top spots to visit in Paris.', category: 'Travel', urlId: 'y5z6a7b8c9d0' },
  { title: 'Easy Pasta Recipe', description: 'Delicious dinner in 15 minutes.', category: 'Food', urlId: 'e1f2g3h4i5j6' },
  { title: 'HIIT Workout Plan', description: 'Burn calories in 20 minutes.', category: 'Fitness', urlId: 'k7l8m9n0o1p2' },
  { title: 'Watercolor Painting Tips', description: 'Master the art of watercolor.', category: 'Art', urlId: 'q3r4s5t6u7v8' },
  { title: 'Quantum Physics Explained', description: 'Simplify complex concepts.', category: 'Science', urlId: 'w9x0y1z2a3b4' },
  { title: 'World War II Facts', description: 'Key events you should know.', category: 'History', urlId: 'c5d6e7f8g9h0' },
  { title: 'Wildlife Safari Adventure', description: 'Explore nature’s wonders.', category: 'Nature', urlId: 'i1j2k3l4m5n6' },
  { title: 'Stand-Up Comedy Routine', description: 'Laugh out loud with me!', category: 'Comedy', urlId: 'o7p8q9r0s1t2' },
  { title: 'Overcoming Fear', description: 'Life advice for confidence.', category: 'Life', urlId: 'u3v4w5x6y7z8' },
];

const generateVideos = () => {
  const videos = [];
  let videoCount = 0;

  while (videoCount < 100) {
    channels.forEach((channel) => {
      if (videoCount >= 100) return;

      // Assign 5-10 videos per channel
      const videosPerChannel = Math.floor(Math.random() * 6) + 5;
      for (let i = 0; i < videosPerChannel && videoCount < 100; i++) {
        const template = videoTemplates[Math.floor(Math.random() * videoTemplates.length)];
        videos.push({
          videoId: uuidv4(),
          title: `${template.title} ${videoCount + 1}`,
          thumbnailUrl: `https://via.placeholder.com/150?text=${encodeURIComponent(template.title)}`,
          description: template.description,
          channelId: channel.channelId,
          uploader: channel.owner,
          videoUrl: `https://www.youtube.com/watch?v=${template.urlId}_${videoCount}`,
          views: Math.floor(Math.random() * 10000),
          likes: Math.floor(Math.random() * 500),
          dislikes: Math.floor(Math.random() * 50),
          uploadDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
          comments: [
            {
              commentId: uuidv4(),
              userId: `user${Math.floor(Math.random() * 10)}`,
              text: `Great ${template.category} video!`,
              timestamp: new Date(),
            },
          ],
        });
        videoCount++;
      }
    });
  }

  return videos.slice(0, 100);
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Atlas connected');

    // Clear existing data
    await Video.deleteMany({});
    await Channel.deleteMany({});
    console.log('Cleared existing videos and channels');

    // Insert channels
    await Channel.insertMany(channels);
    console.log('Seeded channels');

    // Insert videos
    const videos = generateVideos();
    await Video.insertMany(videos);
    console.log('Seeded 100 videos');

    // Update channels with video references
    for (const channel of channels) {
      const channelVideos = videos
        .filter((v) => v.channelId === channel.channelId)
        .map((v) => v._id);
      await Channel.updateOne(
        { channelId: channel.channelId },
        { $set: { videos: channelVideos } }
      );
    }
    console.log('Updated channels with video references');

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seedDatabase();