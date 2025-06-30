import express from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import * as articleController from '../controllers/articleController.js';
import { validateCreateArticle, validateUpdateArticle } from '../middlewares/validateArticle.js';
import { validateCreateComment } from '../middlewares/validateComment.js';

const articleRouter = express.Router();

articleRouter.route('/')
  .post(validateCreateArticle, asyncHandler(articleController.createArticle))
  .get(asyncHandler(articleController.getArticleList));

articleRouter.route('/:id')
  .get(asyncHandler(articleController.getArticle))
  .patch(validateUpdateArticle, asyncHandler(articleController.updateArticle))
  .delete(asyncHandler(articleController.deleteArticle));

articleRouter.route('/:id/comments')
  .post(validateCreateComment, asyncHandler(articleController.createComment))
  .get(asyncHandler(articleController.getCommentList));

export default articleRouter;
