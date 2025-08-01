import { PrismaClient } from '../generated/prisma/index.js';
import { HttpError } from '../utils/httpError.js';

const prisma = new PrismaClient();

export async function createArticle(req, res) {
  const article = await prisma.article.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.status(201).json(article);
}

export async function getArticle(req, res) {
  const id = parseInt(req.params.id);

  const article = await prisma.article.findUnique({
    where: { id },
    include: { likes: true },
  });
  if (!article) {
    throw new HttpError('Article not found', 404);
  }
  
  const articleWithLikes = {
    ...article,
    likesCount: article.likes.length,
    isLiked: req.user
      ? article.likes.some((like) => like.userId === req.user.id)
      : false,
  };
  res.json(articleWithLikes);
}

export async function updateArticle(req, res) {
  const id = parseInt(req.params.id, 10);

  const existingArticle = await prisma.article.findUnique({ where: { id } });
  if (!existingArticle) {
    throw new HttpError('Article not found', 404);
  }

  const article = await prisma.article.update({
    where: { id },
    data: req.body,
  });
  res.json(article);
}

export async function deleteArticle(req, res) {
  const id = parseInt(req.params.id, 10);

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    throw new HttpError('Article not found', 404);
  }

  await prisma.article.delete({ where: { id } });
  res.sendStatus(204);
}

export async function getArticleList(req, res) {
  const { offset, limit, orderBy, keyword } = req.validatedQuery;

  const where = keyword
    ? {
        OR: [{ title: { contains: keyword } }, { content: { contains: keyword } }],
      }
    : {};

  const totalCount = await prisma.article.count({ where });
  const articles = await prisma.article.findMany({
    skip: offset,
    take: limit,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
    include: { likes: true },
  });
  
  const articlesWithLikes = articles.map((article) => ({
    ...article,
    likesCount: article.likes.length,
    isLiked: req.user
      ? article.likes.some((like) => like.userId === req.user.id)
      : false,
  }));

  const nextOffset = articles.length === limit
    ? offset + articles.length
    : null;
  
  res.json({ articles: articlesWithLikes, totalCount, nextOffset });
}

export async function createComment(req, res) {
  const articleId = parseInt(req.params.id, 10);

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new HttpError('Article not found', 404);
  }

  const comment = await prisma.comment.create({
    data: { articleId, content: req.body.content, userId: req.user.id },
  });
  
  res.status(201).json(comment);
}

export async function getCommentList(req, res) {
  const articleId = parseInt(req.params.id, 10);
  const { cursor, limit } = req.validatedQuery;

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new HttpError('Article not found', 404);
  }

  const totalCount = await prisma.comment.count({ where: { articleId } });
  const comments = await prisma.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    skip: cursor ? 1 : 0,
    take: limit,
    orderBy: { id: 'asc' }, 
    where: { articleId },
  });

  const nextCursor = comments.length === limit
    ? comments[comments.length - 1].id
    : null;

  res.json({ comments, totalCount, nextCursor });
}

export async function createLike(req, res) {
  const articleId = parseInt(req.params.id, 10);

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new HttpError('Article not found', 404);
  }

  const existingLike = await prisma.like.findFirst({
    where: { articleId, userId: req.user.id },
  });
  if (existingLike) {
    throw new HttpError('Already liked', 400);
  }

  const like = await prisma.like.create({
    data: { articleId, userId: req.user.id },
  });
  res.status(201).json(like);
}

export async function deleteLike(req, res) {
  const articleId = parseInt(req.params.id, 10);

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new HttpError('Article not found', 404);
  }

  const like = await prisma.like.findFirst({
    where: { articleId, userId: req.user.id },
  });
  if (!like) {
    throw new HttpError('Like not found', 404);
  }

  await prisma.like.delete({ where: { id: like.id } });
  res.sendStatus(204);
}