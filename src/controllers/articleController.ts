import * as ArticleService from '../services/articleService';
import type { RequestHandler } from 'express';
import type { CreateArticleDto, UpdateArticleDto } from '../types/articleTypes';
import type { CreateCommentDto } from '../types/commentTypes';
import type { OffsetQueryDto, CursorQueryDto } from '../types/queryTypes';

// 게시글 등록
export const createArticle: RequestHandler = async (req, res) => {
  const data: CreateArticleDto = {
    ...req.body,
    userId: req.user!.id,
  };

  const createdArticle = await ArticleService.createArticle(data);
  res.status(201).json(createdArticle);
}

// 게시글 조회
export const getArticle: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  const articleWithLikes = await ArticleService.getArticle(id);
  res.status(200).json(articleWithLikes);
}

// 게시글 수정
export const updateArticle: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const data: UpdateArticleDto = req.body;

  const updatedArticle = await ArticleService.updateArticle(id, data);
  res.status(200).json(updatedArticle);
}

// 게시글 삭제
export const deleteArticle: RequestHandler = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  await ArticleService.deleteArticle(id);
  res.sendStatus(204);
}

// 게시글 목록 조회
export const getArticleList: RequestHandler = async (req, res) => {
  const query: OffsetQueryDto = req.validatedQuery;

  const { articles, totalCount } = await ArticleService.getArticleList(query);
  
  const nextOffset = articles.length === query.limit
    ? query.offset + articles.length
    : null;
  
  res.status(200).json({ articles, totalCount, nextOffset });
}

// 댓글 등록
export const createComment: RequestHandler = async (req, res) => {
  const articleId = parseInt(req.params.id, 10);
  const userId = req.user!.id;
  const data: CreateCommentDto = req.body;

  const createdComment = await ArticleService.createComment(data, articleId, userId);
  res.status(201).json(createdComment);
}

// 댓글 목록 조회
export const getCommentList: RequestHandler = async (req, res) => {
  const articleId = parseInt(req.params.id, 10);
  const query: CursorQueryDto = req.validatedQuery;

  const { comments, totalCount } = await ArticleService.getCommentList(articleId, query);

  const nextCursor = comments.length === query.limit
    ? comments[comments.length - 1].id
    : null;

  res.status(200).json({ comments, totalCount, nextCursor });
}

// 좋아요 등록
export const createLike: RequestHandler = async (req, res) => {
  const articleId = parseInt(req.params.id, 10);
  const userId = req.user!.id;

  const createdLike = await ArticleService.createLike(articleId, userId);
  res.status(201).json(createdLike);
}

// 좋아요 삭제
export const deleteLike: RequestHandler = async (req, res) => {
  const articleId = parseInt(req.params.id, 10);
  const userId = req.user!.id;

  await ArticleService.deleteLike(articleId, userId);
  res.sendStatus(204);
}