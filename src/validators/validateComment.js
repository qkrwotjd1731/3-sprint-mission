import { assert, object, partial, size, string } from 'superstruct';

const CreateCommentStruct = object({
  content: size(string(), 1, 500),
});

const UpdateCommentStruct = partial(CreateCommentStruct);

export function validateCreateComment(req, res, next) {
  try {
    assert(req.body, CreateCommentStruct);
    next();
  } catch (err) {
    next(err);
  }
}

export function validateUpdateComment(req, res, next) {
  try {
    assert(req.body, UpdateCommentStruct);
    next();
  } catch (err) {
    next(err);
  }
}