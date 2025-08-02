import { User } from '../generated/prisma';
import type { OffsetQueryDto, CursorQueryDto } from './queryTypes';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, 'id'>;
      validatedQuery?: OffsetQueryDto | CursorQueryDto;
    }
  }
}

export {};