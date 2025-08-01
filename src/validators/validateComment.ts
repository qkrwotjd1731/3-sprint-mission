import { assert, object, partial, size, string } from 'superstruct';
import { RequestHandler } from 'express';

const CreateCommentStruct = object({
  content: size(string(), 1, 500),
});

const UpdateCommentStruct = partial(CreateCommentStruct);

export const validateCreateComment: RequestHandler = (req, res, next) => {
  try {
    assert(req.body, CreateCommentStruct);
    next();
  } catch (err) {
    next(err);
  }
}

export const validateUpdateComment: RequestHandler = (req, res, next) => {
  try {
    assert(req.body, UpdateCommentStruct);
    next();
  } catch (err) {
    next(err);
  }
}