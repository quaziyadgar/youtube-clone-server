import Channel from '../models/Channel.js';
import { v4 as uuidv4 } from 'uuid';

export const getChannel = async (req, res) => {
  try {
    let channel = await Channel.findOne({ channelId: req.params.channelId }).populate('videos');
    if (!channel) {
      channel = new Channel({
        channelId: req.params.channelId,
        name: req.params.channelId,
        owner: req.userId,
        videos: [],
      });
      await channel.save();
    }
    res.json(channel);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createChannel = async (req, res) => {
  const { name } = req.body;
  try {
    const existingChannel = await Channel.findOne({ name });
    if (existingChannel) {
      return res.status(400).json({ error: 'Channel name already exists' });
    }
    const channel = new Channel({
      channelId: uuidv4(),
      name,
      owner: req.userId,
      videos: [],
    });
    await channel.save();
    res.status(201).json(channel);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};