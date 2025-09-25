export enum NotificationType {
  PRICE_CHANGE = 'PRICE_CHANGE',
  COMMENT = 'COMMENT',
}

// 타입 정의
export interface Notification {
  id: number;
  userId: number;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// DTO
export interface CreateNotificationDTO {
  userId: number;
  type: NotificationType;
  message: string;
}
