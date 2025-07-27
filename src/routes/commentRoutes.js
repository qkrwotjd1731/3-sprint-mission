import express from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import * as commentController from '../controllers/commentController.js';
import { validateUpdateComment } from '../validators/validateComment.js';
import { verifyAccessToken, verifyResourceAuth } from '../middlewares/auth.js';

const commentRouter = express.Router();

commentRouter.route('/:id')
  .patch(validateUpdateComment, verifyAccessToken, verifyResourceAuth('comment'), asyncHandler(commentController.updateComment))
  .delete(verifyAccessToken, verifyResourceAuth('comment'), asyncHandler(commentController.deleteComment));

export default commentRouter;