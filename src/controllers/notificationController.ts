import * as NotificationService from '../services/notificationService';
import type { RequestHandler } from 'express';

// 알림 목록 조회
export const getNotificationList: RequestHandler = async (req, res) => {
  const userId = req.user!.id;

  const notifications = await NotificationService.getNotificationList(userId);
  res.status(200).json(notifications);
};

// 알림 미확인 개수 조회
export const getUnreadCount: RequestHandler = async (req, res) => {
  const userId = req.user!.id;

  const unreadCount = await NotificationService.getUnreadCount(userId);
  res.status(200).json(unreadCount);
};

// 알림 읽음 처리
export const readNotification: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  await NotificationService.readNotification(id);
  res.sendStatus(204);
};
