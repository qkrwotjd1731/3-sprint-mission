import { prisma } from '../lib/prisma';
import type { CreateNotificationDto } from '../types/notificationTypes';

export const create = (data: CreateNotificationDto) =>
  prisma.notification.create({ data });

export const findByUserId = (userId: number) =>
  prisma.notification.findMany({ where: { userId } });

export const countUnread = (userId: number) =>
  prisma.notification.count({ where: { userId, isRead: false } });

export const markAsRead = (id: number) =>
  prisma.notification.update({ where: { id }, data: { isRead: true } });
