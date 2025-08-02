import { StructError } from 'superstruct';
import { 
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';
import { HttpError } from '../utils/httpError';
import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // 커스텀 HTTP 에러 (HttpError로 생성된 에러)
  if (err instanceof HttpError) {
    return res.status(err.code).json({ 
      message: err.message,
      data: err.data,
    });
  }

  // Superstruct 검증 or Prisma 검증 에러
  if (err instanceof StructError || err instanceof PrismaClientValidationError) {
    return res.status(400).json({ message: err.message });
  }

  // JSON 파싱 에러
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: 'Invalid JSON format.' });
  }

  // Prisma 레코드 없음 에러
  if (err instanceof PrismaClientKnownRequestError && (err as any).code === 'P2025') {
    return res.status(404).json({ message: 'Resource not found.' });
  }

  // 기타 Prisma 에러
  if (err instanceof PrismaClientKnownRequestError) {
    return res.status(400).json({ message: err.message });
  }

  // JWT 인증 에러
  if (err instanceof Error && err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Unauthorized token.' });
  }

  // JWT 토큰 만료 에러
  if (err instanceof Error && err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired.' });
  }

  // JWT 토큰 형식 에러
  if (err instanceof Error && err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token.' });
  }

  // 기본 서버 에러
  return res.status(500).json({ message: 'Internal server error.' });
} 