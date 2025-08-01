import { PrismaClient } from '../generated/prisma/index.js';
import { HttpError } from '../utils/httpError.js';
import { RequestHandler } from 'express';
import { CreateProductDto, UpdateProductDto, CreateCommentDto } from '../types/productTypes';
import { OffsetQueryDto, CursorQueryDto } from '../types/queryTypes';
import * as ProductService from '../services/productService';

const prisma = new PrismaClient();

// 상품 등록
export const createProduct: RequestHandler = async (req, res) => {
  const data: CreateProductDto = {
    ...req.body,
    userId: req.user!.id,
  };

  const creadtedProduct = await ProductService.createProduct(data);
  res.status(201).json(creadtedProduct);
}

// 상품 조회
export const getProduct: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  const productWithLikes = await ProductService.getProduct(id);
  res.status(200).json(productWithLikes);
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
  const query: OffsetQueryDto = req.validatedQuery;

  const { products, totalCount } = await ProductService.getProductList(query);
  
  const nextOffset = products.length === query.limit
    ? query.offset + products.length
    : null;
  
  res.status(200).json({ products, totalCount, nextOffset });
}

export const createComment: RequestHandler = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const userId = req.user!.id;
  const data: CreateCommentDto = req.body;

  const createdComment = await ProductService.createComment(data, productId, userId);
  res.status(201).json(createdComment);
}

export const getCommentList: RequestHandler = async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const query: CursorQueryDto = req.validatedQuery;

  const { comments, totalCount } = await ProductService.getCommentList(productId, query);

  const nextCursor = comments.length === query.limit
    ? comments[comments.length - 1].id
    : null;

  res.status(200).json({ comments, totalCount, nextCursor });
}

export const createLike: RequestHandler = async (req, res) => {
  const productId = parseInt(req.params.id, 10);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new HttpError('Product not found', 404);
  }

  const existingLike = await prisma.like.findFirst({
    where: { productId, userId: req.user.id },
  });
  if (existingLike) {
    throw new HttpError('Like already exists', 400);
  }

  const like = await prisma.like.create({
    data: { productId, userId: req.user.id }
  });
  res.status(201).json(like);
}

export async function deleteLike(req, res) {
  const productId = parseInt(req.params.id, 10);

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new HttpError('Product not found', 404);
  }

  const like = await prisma.like.findFirst({
    where: { productId, userId: req.user.id },
  });
  if (!like) {
    throw new HttpError('Like not found', 404);
  }

  await prisma.like.delete({ where: { id: like.id } });

  res.sendStatus(204);
}