import { array, assert, integer, min, object, partial, size, string } from 'superstruct';

const CreateProductStruct = object({
  name: size(string(), 1, 30),
  description: size(string(), 1, 500),
  price: min(integer(), 0),
  tags: array(size(string(), 1, 20)),
});

const UpdateProductStruct = partial(CreateProductStruct);

export function validateCreateProduct(req, res, next) {
  try {
    assert(req.body, CreateProductStruct);
    next();
  } catch (err) {
    next(err);
  }
}

export function validateUpdateProduct(req, res, next) {
  try {
    assert(req.body, UpdateProductStruct);
    next();
  } catch (err) {
    next(err);
  }
}