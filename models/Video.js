import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  thumbnailUrl: String,
  description: String,
  channelId: String,
  uploader: String,
  views: Number,
  likes: Number,
  dislikes: Number,
  uploadDate: Date,
  comments: [{
    commentId: String,
    userId: String,
    text: String,
    timestamp: Date,
  }],
});

export default mongoose.model('Video', videoSchema);