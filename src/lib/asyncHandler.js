import { StructError } from 'superstruct';
import { 
  PrismaClientValidationError,
  PrismaClientKnownRequestError,
 } from '@prisma/client/runtime/library';

export function asyncHandler(handler) {
  return async function (req, res) {
    try {
      await handler(req, res);
    } catch (e) {
      if (
        e instanceof StructError ||
        e instanceof PrismaClientValidationError
      ) {
        res.status(400).send({ message: e.message });
      } else if (
        e instanceof PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        res.sendStatus(404);
      } else {
        res.status(500).send({ message: e.message });
      }
    }
  };
}