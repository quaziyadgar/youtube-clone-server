import express from 'express';
import { getChannel, createChannel } from '../controllers/channelController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:channelId', getChannel);
router.post('/', authMiddleware, createChannel);

export default router;