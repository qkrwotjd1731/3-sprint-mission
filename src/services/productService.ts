import * as productRepository from '../repositories/productRepository';
import { HttpError } from '../utils/httpError';
import { createNotification } from './notificationService';
import { NotificationType } from '../types/notificationTypes';
import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  ProductWithLikesDTO,
} from '../types/productTypes';
import type { OffsetQueryDto, CursorQueryDto } from '../types/queryTypes';
import type { Comment, CreateCommentDTO } from '../types/commentTypes';
import type { Like } from '../types/likeTypes';

// 상품 등록
export const createProduct = async (data: CreateProductDTO): Promise<Product> => {
  return await productRepository.create(data);
};

// 상품 조회
export const getProduct = async (id: number, userId?: number): Promise<ProductWithLikesDTO> => {
  const product = await productRepository.findById(id);
  if (!product) {
    throw new HttpError('상품을 찾을 수 없습니다.', 404);
  }

  const likes = await productRepository.findLikes(id);
  const productWithLikes = {
    ...product,
    likesCount: likes.length,
    isLiked: userId ? likes.some((like: Like) => like.userId === userId) : false,
  };
  return productWithLikes;
};

// 상품 수정
export const updateProduct = async (id: number, data: UpdateProductDTO): Promise<Product> => {
  // verifyResourceAuth 미들웨어에서 상품 존재 여부를 확인
  const oldProduct = (await productRepository.findById(id))!;
  const updatedProduct = await productRepository.update(id, data);

  if (oldProduct.price !== updatedProduct.price) {
    const likes = await productRepository.findLikes(id);
    await Promise.all(
      likes.map(async (like: Like) => {
        await createNotification({
          userId: like.userId,
          type: NotificationType.PRICE_CHANGE,
          message: `상품 ${updatedProduct.name}의 가격이 ${oldProduct.price}원에서 ${updatedProduct.price}원으로 변경되었습니다.`,
        });
      }),
    );
  }

  return updatedProduct;
};

// 상품 삭제
export const deleteProduct = async (id: number): Promise<void> => {
  await productRepository.remove(id);
};

// 상품 목록 조회
export const getProductList = async (
  query: OffsetQueryDto,
  userId?: number,
): Promise<{
  products: ProductWithLikesDTO[];
  totalCount: number;
}> => {
  const { offset, limit, orderBy, keyword } = query;

  const [products, totalCount] = await Promise.all([
    productRepository.findMany(offset, limit, orderBy, keyword),
    productRepository.countProducts(keyword),
  ]);

  const productsWithLikes = await Promise.all(
    products.map(async (product: Product) => {
      const likes = await productRepository.findLikes(product.id);
      return {
        ...product,
        likesCount: likes.length,
        isLiked: userId ? likes.some((like: Like) => like.userId === userId) : false,
      };
    }),
  );

  return { products: productsWithLikes, totalCount };
};

// 댓글 등록
export const createComment = async (
  data: CreateCommentDTO,
  productId: number,
  userId: number,
): Promise<Comment> => {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new HttpError('상품을 찾을 수 없습니다.', 404);
  }

  return await productRepository.createComment(data, userId, productId);
};

// 댓글 목록 조회
export const getCommentList = async (
  productId: number,
  query: CursorQueryDto,
): Promise<{
  comments: Comment[];
  totalCount: number;
}> => {
  const { cursor, limit } = query;

  const product = await productRepository.findById(productId);
  if (!product) {
    throw new HttpError('상품을 찾을 수 없습니다.', 404);
  }

  const [comments, totalCount] = await Promise.all([
    productRepository.findComments(productId, cursor, limit),
    productRepository.countComments(productId),
  ]);

  return { comments, totalCount };
};

// 좋아요 등록
export const createLike = async (productId: number, userId: number): Promise<Like> => {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new HttpError('상품을 찾을 수 없습니다.', 404);
  }

  const existingLike = await productRepository.findLike(productId, userId);
  if (existingLike) {
    throw new HttpError('이미 좋아요를 누른 상태입니다.', 409);
  }

  return await productRepository.createLike(productId, userId);
};

// 좋아요 삭제
export const deleteLike = async (productId: number, userId: number): Promise<void> => {
  const product = await productRepository.findById(productId);
  if (!product) {
    throw new HttpError('상품을 찾을 수 없습니다.', 404);
  }

  const targetLike = await productRepository.findLike(productId, userId);
  if (!targetLike) {
    throw new HttpError('좋아요를 찾을 수 없습니다.', 404);
  }

  await productRepository.deleteLike(targetLike.id);
};
