import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  thumbnailUrl: String,
  videoUrl: String,
  description: String,
  channelId: String,
  uploader: String,
  likes: [{
    type: String,
  }],
  dislikes: [{
    type: String,
  }],
  uploadDate: Date,
  comments: [{
    commentId: String,
    userId: String,
    text: String,
    timestamp: Date,
  }],
});

export default mongoose.model('Video', videoSchema);