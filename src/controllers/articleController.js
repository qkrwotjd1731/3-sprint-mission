import { PrismaClient } from '../generated/prisma/index.js';
import { throwHttpError } from '../utils/httpError.js';

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
    throwHttpError('Article not found', 404);
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
    throwHttpError('Article not found', 404);
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
    throwHttpError('Article not found', 404);
  }

  await prisma.article.delete({ where: { id } });
  res.sendStatus(204);
}

export async function getArticleList(req, res) {
  const { offset = 0, limit = 10, orderBy, keyword } = req.validatedQuery;

  const where = keyword
    ? {
        OR: [{ title: { contains: keyword } }, { content: { contains: keyword } }],
      }
    : {};
  const articles = await prisma.article.findMany({
    skip: parseInt(offset, 10),
    take: parseInt(limit, 10),
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
  
  res.json(articlesWithLikes);
}

export async function createComment(req, res) {
  const articleId = parseInt(req.params.id, 10);

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throwHttpError('Article not found', 404);
  }

  const comment = await prisma.comment.create({
    data: { articleId, content: req.body.content, userId: req.user.id },
  });
  
  res.status(201).json(comment);
}

export async function getCommentList(req, res) {
  const articleId = parseInt(req.params.id, 10);
  const { cursor, limit = 10 } = req.query;

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throwHttpError('Article not found', 404);
  }

  const comments = await prisma.comment.findMany({
    cursor: cursor ? { id: parseInt(cursor, 10) } : undefined,
    skip: cursor ? 1 : 0,
    take: parseInt(limit, 10),
    where: { articleId },
  });

  res.json(comments);
}

export async function createLike(req, res) {
  const articleId = parseInt(req.params.id, 10);

  const article = await prisma.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throwHttpError('Article not found', 404);
  }

  const existingLike = await prisma.like.findFirst({
    where: { articleId, userId: req.user.id },
  });
  if (existingLike) {
    throwHttpError('Already liked', 400);
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
    throwHttpError('Article not found', 404);
  }

  const like = await prisma.like.findFirst({
    where: { articleId, userId: req.user.id },
  });
  if (!like) {
    throwHttpError('Like not found', 404);
  }

  await prisma.like.delete({ where: { id: existingLike.id } });
  res.sendStatus(204);
}