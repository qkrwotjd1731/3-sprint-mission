import * as ProductRepository from '../repositories/productRepository';
import { HttpError } from '../utils/httpError';
import type {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
  ProductWithLikesDto,
} from '../types/productTypes';
import type { OffsetQueryDto, CursorQueryDto } from '../types/queryTypes';
import type { CreateCommentDto, CommentResponseDto } from '../types/commentTypes';
import type { LikeResponseDto } from '../types/likeTypes';

// 상품 등록
export const createProduct = async (data: CreateProductDto): Promise<ProductResponseDto> => {
  return ProductRepository.create(data);
}

// 상품 조회
export const getProduct = async (id: number): Promise<ProductWithLikesDto> => {
  const product = await ProductRepository.findById(id);
  if (!product) {
    throw new HttpError('Product not found', 404);
  }

  const likes = await ProductRepository.findLikes(id);
  const productWithLikes = {
    ...product,
    likesCount: likes.length,
    isLiked: product.userId ? likes.some((like) => like.userId === product.userId) : false,
  };
  return productWithLikes;
}

// 상품 수정
export const updateProduct = async (id: number, data: UpdateProductDto): Promise<ProductResponseDto> => {
  return ProductRepository.update(id, data);
}

// 상품 삭제
export const deleteProduct = async (id: number): Promise<void> => {
  await ProductRepository.remove(id);
}

// 상품 목록 조회
export const getProductList = async (query: OffsetQueryDto): Promise<{
  products: ProductWithLikesDto[];
  totalCount: number;
}> => {
  const { offset, limit, orderBy, keyword } = query;

  const [products, totalCount] = await Promise.all([
    ProductRepository.findMany(offset, limit, orderBy, keyword),
    ProductRepository.countProducts(keyword)
  ]);

  const productsWithLikes = await Promise.all(products.map(async (product) => {
    const likes = await ProductRepository.findLikes(product.id);
    return {
      ...product,
      likesCount: likes.length,
      isLiked: product.userId ? likes.some((like) => like.userId === product.userId) : false,
    };
  }));

  return { products: productsWithLikes, totalCount };
}

// 댓글 등록
export const createComment = async (data: CreateCommentDto, productId: number, userId: number): Promise<CommentResponseDto> => {
  const product = await ProductRepository.findById(productId);
  if (!product) {
    throw new HttpError('Product not found', 404);
  }

  return ProductRepository.createComment(data, userId, productId);
}

// 댓글 목록 조회
export const getCommentList = async (productId: number, query: CursorQueryDto): Promise<{
  comments: CommentResponseDto[];
  totalCount: number;
}> => {
  const { cursor, limit } = query;

  const product = await ProductRepository.findById(productId);
  if (!product) {
    throw new HttpError('Product not found', 404);
  }

  const [comments, totalCount] = await Promise.all([
    ProductRepository.findComments(productId, cursor, limit),
    ProductRepository.countComments(productId)
  ]);

  return { comments, totalCount };
}

// 좋아요 등록
export const createLike = async (productId: number, userId: number): Promise<LikeResponseDto> => {
  const product = await ProductRepository.findById(productId);
  if (!product) {
    throw new HttpError('Product not found', 404);
  }

  const existingLike = await ProductRepository.findLike(productId, userId);
  if (existingLike) {
    throw new HttpError('Like already exists', 400);
  }

  return ProductRepository.createLike(productId, userId);
}

// 좋아요 삭제
export const deleteLike = async (productId: number, userId: number): Promise<void> => {
  const product = await ProductRepository.findById(productId);
  if (!product) {
    throw new HttpError('Product not found', 404);
  }

  const targetLike = await ProductRepository.findLike(productId, userId);
  if (!targetLike) {
    throw new HttpError('Like not found', 404);
  }

  await ProductRepository.deleteLike(targetLike.id);
}