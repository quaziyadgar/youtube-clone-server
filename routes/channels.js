import express from 'express';
import { getChannels, getChannel, createChannel } from '../controllers/channelController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:channelId', getChannel);
router.post('/createChannel', authMiddleware, createChannel);
router.get('/', authMiddleware, getChannels);

export default router;