import Video from '../models/Video.js';
import Channel from '../models/Channel.js';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

export const getAllVideos = async (req, res, next) => {
  try {
    const { search } = req.query;
    let videos;
    if (search) {
      videos = await Video.find({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ],
      });
    } else {
      videos = await Video.find();
    }
    res.json(videos);
  } catch (error) {
    next(error);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    video.views += 1;
    await video.save();
    res.json(video);
  } catch (error) {
    next(error);
  }
};

export const createVideo = async (req, res, next) => {
  const { title, description, channelId, videoUrl } = req.body;
  try {
    if (!videoUrl) {
      return res.status(400).json({ error: 'Video URL required' });
    }
    const video = new Video({
      videoId: uuidv4(),
      title,
      thumbnailUrl: `https://img.youtube.com/vi/${videoUrl.split('v=')[1]}/0.jpg`,
      description,
      channelId,
      uploader: req.userId,
      videoUrl,
      views: 0,
      likes: 0,
      dislikes: 0,
      uploadDate: new Date(),
      comments: [],
    });
    await video.save();
    const channel = await Channel.findOne({ channelId });
    if (channel && channel.owner === req.userId) {
      channel.videos.push(video._id);
      await channel.save();
    }
    res.status(201).json(video);
  } catch (error) {
    next(error);
  }
};

export const streamVideo = async (req, res, next) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video || !video.videoUrl) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.redirect(video.videoUrl);
  } catch (error) {
    next(error);
  }
};

export const updateVideo = async (req, res, next) => {
  const { title, description, likes, dislikes, videoUrl } = req.body;
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
    video.videoUrl = videoUrl || video.videoUrl;
    if (likes !== undefined) video.likes += likes;
    if (dislikes !== undefined) video.dislikes += dislikes;
    await video.save();
    res.json(video);
  } catch (error) {
    next(error);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findOne({ videoId: req.params.videoId });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    if (video.uploader !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await video.deleteOne();
    const channel = await Channel.findOne({ channelId: video.channelId });
    if (channel) {
      channel.videos = channel.videos.filter((vid) => vid.toString() !== video._id.toString());
      await channel.save();
    }
    res.json({ message: 'Video deleted' });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
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
    video.comments = video.comments || [];
    video.comments.push(comment);
    await video.save();
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};