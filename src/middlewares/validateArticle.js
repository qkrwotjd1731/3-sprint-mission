import { coerce, object, partial, size, string, create } from 'superstruct';

export const CreateArticleStruct = object({
  title: coerce(size(string(), 1, 30), string(), (value) => value.trim()),
  content: size(string(), 1, 5000),
});

export const UpdateArticleStruct = partial(CreateArticleStruct);

export function validateCreateArticle(req, res, next) {
  try {
    const data = create(req.body, CreateArticleStruct);
    req.validatedData = data;
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export function validateUpdateArticle(req, res, next) {
  try {
    const data = create(req.body, UpdateArticleStruct);
    req.validatedData = data;
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}