import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelId: String,
  name: String,
  owner: String,
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
});

export default mongoose.model('Channel', channelSchema);