import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import * as commentController from '../controllers/commentController';
import { validateUpdateComment } from '../validators/validateComment.js';
import { verifyAccessToken, verifyResourceAuth } from '../middlewares/auth.js';
import { ResourceType } from '../types/authTypes.js';

const commentRouter = Router();

commentRouter.route('/:id')
  .patch(validateUpdateComment, verifyAccessToken, verifyResourceAuth(ResourceType.Comment), asyncHandler(commentController.updateComment))
  .delete(verifyAccessToken, verifyResourceAuth(ResourceType.Comment), asyncHandler(commentController.deleteComment));

export default commentRouter; 