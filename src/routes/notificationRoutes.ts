import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import * as notificationController from '../controllers/notificationController';
import { verifyAccessToken } from '../middlewares/auth';

const notificationRouter = Router();

notificationRouter.use(verifyAccessToken);

notificationRouter.get('/', asyncHandler(notificationController.getNotificationList));
notificationRouter.get('/unread-count', asyncHandler(notificationController.getUnreadCount));
notificationRouter.patch('/:id', asyncHandler(notificationController.readNotification));

export default notificationRouter;
