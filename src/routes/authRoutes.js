import express from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import * as authController from '../controllers/authController.js';
import { validateCreateUser, validateLogin } from '../validators/validateAuth.js';
import { verifyRefreshToken } from '../middlewares/auth.js';

const authRouter = express.Router();

authRouter.post('/', validateCreateUser, asyncHandler(authController.createUser));
authRouter.post('/login', validateLogin, asyncHandler(authController.login));
authRouter.post('/logout', asyncHandler(authController.logout));
authRouter.post('/refresh', verifyRefreshToken, asyncHandler(authController.refreshToken));

export default authRouter;