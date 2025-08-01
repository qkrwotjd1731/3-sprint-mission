import { User } from '../generated/prisma';
import { OffsetParamsDto, CursorParamsDto } from './queryTypes';

declare global {
  namespace Express {
    interface Request {
      user?: Pick<User, 'id'>;
      validatedQuery?: OffsetParamsDto | CursorParamsDto;
    }
  }
}