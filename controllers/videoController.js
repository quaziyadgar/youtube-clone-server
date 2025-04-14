import Video from '../models/Video.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createVideo = async (req, res) => {
  const { title, thumbnailUrl, description, channelId } = req.body;
  try {
    const video = new Video({
      videoId: uuidv4(),
      title,
      thumbnailUrl,
      description,
      channelId,
      uploader: req.userId,
      views: 0,
      likes: 0,
      dislikes: 0,
      uploadDate: new Date(),
      comments: [],
    });
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateVideo = async (req, res) => {
  const { title, description, likes, dislikes } = req.body;
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    if (video.uploader !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    video.title = title || video.title;
    video.description = description || video.description;
    video.likes = likes !== undefined ? likes : video.likes;
    video.dislikes = dislikes !== undefined ? dislikes : video.dislikes;
    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    if (video.uploader !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await video.deleteOne();
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const addComment = async (req, res) => {
  const { text } = req.body;
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    const comment = {
      commentId: uuidv4(),
      userId: req.userId,
      text,
      timestamp: new Date(),
    };
    video.comments.push(comment);
    await video.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};