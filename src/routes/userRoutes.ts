import express, { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import * as userController from '../controllers/userController.js';
import { validateUpdateUser, validateUpdatePassword } from '../validators/validateUser.js';
import { validateOffsetParams } from '../validators/validateQuery.js';
import { verifyAccessToken } from '../middlewares/auth.js';

const userRouter: Router = express.Router();

userRouter.route('/me')
  .get(verifyAccessToken, asyncHandler(userController.getMe))
  .patch(validateUpdateUser, verifyAccessToken, asyncHandler(userController.updateMe));
userRouter.patch('/me/password', validateUpdatePassword, verifyAccessToken, asyncHandler(userController.updatePassword));
userRouter.get('/me/products', validateOffsetParams, verifyAccessToken, asyncHandler(userController.getMyProductList));
userRouter.get('/me/likes', validateOffsetParams, verifyAccessToken, asyncHandler(userController.getMyLikeList));

export default userRouter; 