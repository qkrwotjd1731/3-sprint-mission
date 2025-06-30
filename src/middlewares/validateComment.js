import { array, coerce, integer, min, object, partial, size, string, create } from 'superstruct';

export const CreateCommentStruct = object({
  content: size(string(), 1, 500),
});

export const UpdateCommentStruct = partial(CreateCommentStruct);

export function validateCreateComment(req, res, next) {
  try {
    const data = create(req.body, CreateCommentStruct);
    req.validatedData = data;
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export function validateUpdateComment(req, res, next) {
  try {
    const data = create(req.body, UpdateCommentStruct);
    req.validatedData = data;
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}