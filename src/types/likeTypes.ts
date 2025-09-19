// 타입 정의
export interface Like {
  id: number;
  userId: number;
  productId: number | null;
  articleId: number | null;
  createdAt: Date;
  updatedAt: Date;
}
