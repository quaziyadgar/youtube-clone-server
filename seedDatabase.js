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
  { title: 'React Hooks Tutorial', description: 'Learn React Hooks in 10 minutes!', category: 'Tech', videoUrl: 'https://www.youtube.com/watch?v=TNhaISOUy6Q' },
  { title: 'Node.js Crash Course', description: 'Build a REST API with Express.', category: 'Tech', videoUrl: 'https://www.youtube.com/watch?v=fBNz5xF-Kx4' },
  { title: 'Morning Routine Vlog', description: 'Start your day with me!', category: 'Vlog', videoUrl: 'https://www.youtube.com/watch?v=5AyhS1vC1wo' },
  { title: 'Epic Gaming Montage', description: 'Best moments from my streams.', category: 'Gaming', videoUrl: 'https://www.youtube.com/watch?v=3b2rBx2l2vA' },
  { title: 'Guitar Cover - Pop Hits', description: 'Acoustic covers of your favorites.', category: 'Music', videoUrl: 'https://www.youtube.com/watch?v=0I647GU3Jsc' },
  { title: 'DIY Home Decor', description: 'Make your space cozy on a budget.', category: 'DIY', videoUrl: 'https://www.youtube.com/watch?v=Z7zngqaWJ4I' },
  { title: 'Paris Travel Guide', description: 'Top spots to visit in Paris.', category: 'Travel', videoUrl: 'https://www.youtube.com/watch?v=AKeYvGykJsc' },
  { title: 'Easy Pasta Recipe', description: 'Delicious dinner in 15 minutes.', category: 'Food', videoUrl: 'https://www.youtube.com/watch?v=OTDnv1TfJ6w' },
  { title: 'HIIT Workout Plan', description: 'Burn calories in 20 minutes.', category: 'Fitness', videoUrl: 'https://www.youtube.com/watch?v=ml6N-4Kq39A' },
  { title: 'Watercolor Painting Tips', description: 'Master the art of watercolor.', category: 'Art', videoUrl: 'https://www.youtube.com/watch?v=6iEFGxwF5pI' },
  { title: 'Quantum Physics Explained', description: 'Simplify complex concepts.', category: 'Science', videoUrl: 'https://www.youtube.com/watch?v=Usu9xZfabPM' },
  { title: 'World War II Facts', description: 'Key events you should know.', category: 'History', videoUrl: 'https://www.youtube.com/watch?v=HZsIgu8Sg9s' },
  { title: 'Wildlife Safari Adventure', description: 'Explore nature’s wonders.', category: 'Nature', videoUrl: 'https://www.youtube.com/watch?v=7X0hO9Frr1o' },
  { title: 'Stand-Up Comedy Routine', description: 'Laugh out loud with me!', category: 'Comedy', videoUrl: 'https://www.youtube.com/watch?v=8gpjk_MaCGM' },
  { title: 'Overcoming Fear', description: 'Life advice for confidence.', category: 'Life', videoUrl: 'https://www.youtube.com/watch?v=2yq5O8x4q0g' },
];

const generateVideos = () => {
  const videos = [];
  let videoCount = 0;

  while (videoCount < 100) {
    channels.forEach((channel) => {
      if (videoCount >= 100) return;

      const videosPerChannel = Math.floor(Math.random() * 6) + 5;
      for (let i = 0; i < videosPerChannel && videoCount < 100; i++) {
        const template = videoTemplates[Math.floor(Math.random() * videoTemplates.length)];
        videos.push({
          videoId: uuidv4(),
          title: `${template.title} ${videoCount + 1}`,
          thumbnailUrl: `https://img.youtube.com/vi/${template.videoUrl.split('v=')[1]}/0.jpg`,
          description: template.description,
          channelId: channel.channelId,
          uploader: channel.owner,
          videoUrl: template.videoUrl,
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

    await Video.deleteMany({});
    await Channel.deleteMany({});
    console.log('Cleared existing videos and channels');

    await Channel.insertMany(channels);
    console.log('Seeded channels');

    const videos = generateVideos();
    await Video.insertMany(videos);
    console.log('Seeded 100 videos');

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