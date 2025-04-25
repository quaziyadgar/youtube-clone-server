import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  thumbnailUrl: String,
  videoUrl: String,
  description: String,
  channelId: String,
  uploader: String,
  views: Number,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  uploadDate: Date,
  comments: [{
    commentId: String,
    userId: String,
    text: String,
    timestamp: Date,
  }],
});

export default mongoose.model('Video', videoSchema);