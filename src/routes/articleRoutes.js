import express from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import * as articleController from '../controllers/articleController.js';
import { validateCreateArticle, validateUpdateArticle } from '../validators/validateArticle.js';
import { validateOffsetParams, validateCursorParams } from '../validators/validateQuery.js';
import { validateCreateComment } from '../validators/validateComment.js';
import { verifyAccessToken, verifyResourceAuth, optionalAuth } from '../middlewares/auth.js';

const articleRouter = express.Router();

articleRouter.route('/')
  .post(validateCreateArticle, verifyAccessToken, asyncHandler(articleController.createArticle))
  .get(optionalAuth, validateOffsetParams, asyncHandler(articleController.getArticleList));

articleRouter.route('/:id')
  .get(optionalAuth, asyncHandler(articleController.getArticle))
  .patch(validateUpdateArticle, verifyAccessToken, verifyResourceAuth('article'), asyncHandler(articleController.updateArticle))
  .delete(verifyAccessToken, verifyResourceAuth('article'), asyncHandler(articleController.deleteArticle));

articleRouter.route('/:id/comments')
  .post(validateCreateComment, verifyAccessToken, asyncHandler(articleController.createComment))
  .get(validateCursorParams, asyncHandler(articleController.getCommentList));

articleRouter.route('/:id/likes')
  .post(verifyAccessToken, asyncHandler(articleController.createLike))
  .delete(verifyAccessToken, asyncHandler(articleController.deleteLike));

export default articleRouter;
