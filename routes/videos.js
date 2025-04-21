import express from 'express';
import {
  getAllVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  addComment,
  editComment,
  deleteComment
} from '../controllers/videoController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllVideos);
router.get('/:videoId', getVideo);
router.post('/', authMiddleware, createVideo);
router.put('/:videoId', authMiddleware, updateVideo);
router.delete('/:videoId', authMiddleware, deleteVideo);
router.post('/:videoId/comments', authMiddleware, addComment);
router.put('/:videoId/comments/:commentId', authMiddleware, editComment);
router.delete('/:videoId/comments/:commentId', authMiddleware, deleteComment);

export default router;