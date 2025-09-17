import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import * as authController from '../controllers/authController';
import { validateCreateUser, validateLogin } from '../validators/validateAuth';
import { verifyAccessToken, verifyRefreshToken } from '../middlewares/auth';

const authRouter = Router();

authRouter.post('/signup', validateCreateUser, asyncHandler(authController.createUser));
authRouter.post('/login', validateLogin, asyncHandler(authController.login));
authRouter.post('/logout', verifyAccessToken, asyncHandler(authController.logout));
authRouter.post('/refresh', verifyRefreshToken, asyncHandler(authController.refreshToken));

export default authRouter;
