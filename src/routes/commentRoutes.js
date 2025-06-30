import express from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import * as commentController from '../controllers/commentController.js';
import { validateUpdateComment } from '../middlewares/validateComment.js';

const commentRouter = express.Router();

commentRouter.route('/:id')
  .patch(validateUpdateComment, asyncHandler(commentController.updateComment))
  .delete(asyncHandler(commentController.deleteComment));

export default commentRouter;