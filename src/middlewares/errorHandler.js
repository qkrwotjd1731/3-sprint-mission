import { StructError } from 'superstruct';
import { 
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime/library';

export function errorHandler(err, req, res, next) {
  // Superstruct 검증 or Prisma 검증 에러
  if (err instanceof StructError || err instanceof PrismaClientValidationError) {
    return res.status(400).json({ message: err.message });
  }

  // JSON 파싱 에러
  if (err instanceof SyntaxError) {
    return res.status(400).json({ message: 'Invalid JSON format.' });
  }

  // Prisma 레코드 없음 에러
  if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
    return res.status(404).json({ message: 'Resource not found.' });
  }

  // 기타 Prisma 에러
  if (err instanceof PrismaClientKnownRequestError) {
    return res.status(400).json({ message: err.message });
  }

  // 기본 서버 에러
  return res.status(500).json({ message: 'Internal server error.' });
} 