import type { Product, CreateProductDTO, UpdateProductDTO } from '../../src/types/productTypes';
import type { Comment, CreateCommentDTO } from '../../src/types/commentTypes';
import type { Like } from '../../src/types/likeTypes';
import { HttpError } from '../../src/utils/httpError';

// Mock 상품 데이터
export const mockProduct: Product = {
  id: 1,
  name: '테스트 상품',
  description: '테스트용 상품 설명',
  price: 10000,
  tags: ['테스트', '샘플'],
  userId: 1,
  createdAt: new Date('2025-09-19T13:00:00Z'),
  updatedAt: new Date('2025-09-19T13:00:00Z'),
};

export const mockCreateProductDTO: CreateProductDTO = {
  name: '새로운 상품',
  description: '새로운 상품 설명',
  price: 15000,
  tags: ['새상품', '테스트'],
  userId: 1,
};

export const mockUpdateProductDTO: UpdateProductDTO = {
  name: '수정된 상품',
  description: '수정된 상품 설명',
  price: 20000,
  userId: 1,
};

// Mock 댓글 데이터
export const mockComment: Comment = {
  id: 1,
  content: '좋은 상품이네요!',
  userId: 2,
  productId: 1,
  articleId: null,
  createdAt: new Date('2025-09-19T13:00:00Z'),
  updatedAt: new Date('2025-09-19T13:00:00Z'),
};

export const mockCreateCommentDTO: CreateCommentDTO = {
  content: '새로운 댓글입니다.',
};

// Mock 좋아요 데이터
export const mockLike: Like = {
  id: 1,
  userId: 2,
  productId: 1,
  articleId: null,
  createdAt: new Date('2025-09-19T13:00:00Z'),
  updatedAt: new Date('2025-09-19T13:00:00Z'),
};

// Mock 사용자 데이터
export const mockUser = {
  id: 1,
  email: 'test@example.com',
  nickname: '테스트사용자',
  createdAt: new Date('2025-09-19T13:00:00Z'),
  updatedAt: new Date('2025-09-19T13:00:00Z'),
};

// Mock 에러 데이터
export const mockDatabaseError = new HttpError('데이터베이스 연결에 실패했습니다.', 500);
export const mockValidationError = new HttpError('잘못된 요청입니다.', 400);
export const mockNotFoundError = new HttpError('상품을 찾을 수 없습니다.', 404);
export const mockUnauthorizedError = new HttpError('로그인이 필요합니다.', 401);
export const mockForbiddenError = new HttpError('접근 권한이 없습니다.', 403);
export const mockConflictError = new HttpError('이미 좋아요를 누른 상태입니다.', 409);
