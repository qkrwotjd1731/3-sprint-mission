import * as notificationRepository from '../repositories/notificationRepository';
import { io } from '../socket';
import type { Notification, CreateNotificationDTO } from '../types/notificationTypes';

// 알림 생성
export const createNotification = async (data: CreateNotificationDTO): Promise<Notification> => {
  const notification = await notificationRepository.create(data);

  io.to(notification.userId.toString()).emit('notification', notification);
  return notification;
};

// 알림 목록 조회
export const getNotificationList = async (userId: number): Promise<Notification[]> => {
  return notificationRepository.findByUserId(userId);
};

// 알림 미확인 개수 조회
export const getUnreadCount = async (userId: number): Promise<number> => {
  return notificationRepository.countUnread(userId);
};

// 알림 읽음 처리
export const readNotification = async (id: number): Promise<Notification> => {
  return notificationRepository.markAsRead(id);
};
