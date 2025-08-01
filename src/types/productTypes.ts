import { Product } from '../generated/prisma';

export type ProductResponseDto = Product;

export type CreateProductDto = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateProductDto = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>;

export interface ProductWithLikesDto extends ProductResponseDto {
  likesCount: number;
  isLiked: boolean;
}

export interface CreateCommentDto {
  content: string;
};

export interface LikeResponseDto {
  productId: number;
  userId: number;
}