import { NotificationType } from '../generated/prisma';

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface CreateNotificationDto {
  userId: number;
  type: NotificationType;
  message: string;
}
