import * as ProductService from '../services/productService';
import type { RequestHandler } from 'express';
import type { CreateProductDto, UpdateProductDto } from '../types/productTypes';
import type { CreateCommentDto } from '../types/commentTypes';
import type { OffsetQueryDto, CursorQueryDto } from '../types/queryTypes';

// 상품 등록
export const createProduct: RequestHandler = async (req, res) => {
  const data: CreateProductDto = {
    ...req.body,
    userId: req.user!.id,
  };

  const createdProduct = await ProductService.createProduct(data);
  res.status(201).json(createdProduct);
}

// 상품 조회
export const getProduct: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const userId = req.user?.id;

  const product = await ProductService.getProduct(id, userId);
  res.status(200).json(product);
}

// 상품 수정
export const updateProduct: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data: UpdateProductDto = req.body;

  const updatedProduct = await ProductService.updateProduct(id, data);
  res.status(200).json(updatedProduct);
}

// 상품 삭제
export const deleteProduct: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  await ProductService.deleteProduct(id);
  res.sendStatus(204);
}

// 상품 목록 조회
export const getProductList: RequestHandler = async (req, res) => {
  const query = req.validatedQuery as OffsetQueryDto;
  const userId = req.user?.id;

  const { products, totalCount } = await ProductService.getProductList(query, userId);
  
  const nextOffset = products.length === query.limit
    ? query.offset + products.length
    : null;
  
  res.status(200).json({ products, totalCount, nextOffset });
}

// 댓글 등록
export const createComment: RequestHandler = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const userId = req.user!.id;
  const data: CreateCommentDto = req.body;

  const createdComment = await ProductService.createComment(data, productId, userId);
  res.status(201).json(createdComment);
}

// 댓글 목록 조회
export const getCommentList: RequestHandler = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const query = req.validatedQuery as CursorQueryDto;

  const { comments, totalCount } = await ProductService.getCommentList(productId, query);

  const nextCursor = comments.length === query.limit
    ? comments[comments.length - 1].id
    : null;

  res.status(200).json({ comments, totalCount, nextCursor });
}

// 좋아요 등록
export const createLike: RequestHandler = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const userId = req.user!.id;

  const createdLike = await ProductService.createLike(productId, userId);
  res.status(201).json(createdLike);
}

// 좋아요 삭제
export const deleteLike: RequestHandler = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const userId = req.user!.id;

  await ProductService.deleteLike(productId, userId);
  res.sendStatus(204);
}