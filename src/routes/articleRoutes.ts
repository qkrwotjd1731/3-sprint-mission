import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import * as articleController from '../controllers/articleController';
import { validateCreateArticle, validateUpdateArticle } from '../validators/validateArticle';
import { validateOffsetParams, validateCursorParams } from '../validators/validateQuery';
import { validateCreateComment } from '../validators/validateComment';
import { verifyAccessToken, verifyResourceAuth, optionalAuth } from '../middlewares/auth';
import { ResourceType } from '../types/authTypes';

const articleRouter = Router();

articleRouter.route('/')
  .post(validateCreateArticle, verifyAccessToken, asyncHandler(articleController.createArticle))
  .get(optionalAuth, validateOffsetParams, asyncHandler(articleController.getArticleList));

articleRouter.route('/:id')
  .get(optionalAuth, asyncHandler(articleController.getArticle))
  .patch(validateUpdateArticle, verifyAccessToken, verifyResourceAuth(ResourceType.Article), asyncHandler(articleController.updateArticle))
  .delete(verifyAccessToken, verifyResourceAuth(ResourceType.Article), asyncHandler(articleController.deleteArticle));

articleRouter.route('/:id/comments')
  .post(validateCreateComment, verifyAccessToken, asyncHandler(articleController.createComment))
  .get(validateCursorParams, asyncHandler(articleController.getCommentList));

articleRouter.route('/:id/likes')
  .post(verifyAccessToken, asyncHandler(articleController.createLike))
  .delete(verifyAccessToken, asyncHandler(articleController.deleteLike));

export default articleRouter; 