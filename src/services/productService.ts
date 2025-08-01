import { HttpError } from '../utils/httpError';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductResponseDto,
  ProductWithLikesDto,
  CreateCommentDto
} from '../types/productTypes';
import { OffsetQueryDto, CursorQueryDto } from '../types/queryTypes';
import { CommentResponseDto } from '../types/commentTypes';
import * as ProductRepository from '../repositories/productRepository';

export const createProduct = (data: CreateProductDto): Promise<ProductResponseDto> => {
  return ProductRepository.create(data);
}

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

export const updateProduct = (id: number, data: UpdateProductDto): Promise<ProductResponseDto> => {
  return ProductRepository.update(id, data);
}

export const deleteProduct = (id: number): Promise<ProductResponseDto> => {
  return ProductRepository.remove(id);
}

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

export const createComment = async (data: CreateCommentDto, productId: number, userId: number): Promise<CommentResponseDto> => {
  const product = await ProductRepository.findById(productId);
  if (!product) {
    throw new HttpError('Product not found', 404);
  }

  return ProductRepository.createComment(data, userId, productId);
}

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

export const createLike = async (productId: number, userId: number): Promise<LikeResponseDto> => {