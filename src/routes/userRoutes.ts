import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import * as userController from '../controllers/userController';
import { validateUpdateUser, validateUpdatePassword } from '../validators/validateUser';
import { validateOffsetParams } from '../validators/validateQuery';
import { verifyAccessToken } from '../middlewares/auth';

const userRouter = Router();

userRouter
  .route('/me')
  .get(verifyAccessToken, asyncHandler(userController.getMe))
  .patch(validateUpdateUser, verifyAccessToken, asyncHandler(userController.updateMe));
userRouter.patch(
  '/me/password',
  validateUpdatePassword,
  verifyAccessToken,
  asyncHandler(userController.updatePassword),
);
userRouter.get(
  '/me/products',
  validateOffsetParams,
  verifyAccessToken,
  asyncHandler(userController.getMyProductList),
);
userRouter.get(
  '/me/likes',
  validateOffsetParams,
  verifyAccessToken,
  asyncHandler(userController.getMyLikeProductList),
);

export default userRouter;
