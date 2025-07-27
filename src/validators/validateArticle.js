import { assert, object, partial, size, string } from 'superstruct';

const CreateArticleStruct = object({
  title: size(string(), 1, 30),
  content: size(string(), 1, 5000),
});

const UpdateArticleStruct = partial(CreateArticleStruct);

export function validateCreateArticle(req, res, next) {
  try {
    assert(req.body, CreateArticleStruct);
    next();
  } catch (err) {
    next(err);
  }
}

export function validateUpdateArticle(req, res, next) {
  try {
    assert(req.body, UpdateArticleStruct);
    next();
  } catch (err) {
    next(err);
  }
}