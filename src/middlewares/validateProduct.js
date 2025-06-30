import { array, coerce, integer, min, object, partial, size, string, create } from 'superstruct';

export const CreateProductStruct = object({
  name: coerce(size(string(), 1, 30), string(), (value) => value.trim()),
  description: size(string(), 1, 500),
  price: min(integer(), 0),
  tags: array(size(string(), 1, 20)),
});

export const UpdateProductStruct = partial(CreateProductStruct);

export function validateCreateProduct(req, res, next) {
  try {
    const data = create(req.body, CreateProductStruct);
    req.validatedData = data;
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

export function validateUpdateProduct(req, res, next) {
  try {
    const data = create(req.body, UpdateProductStruct);
    req.validatedData = data;
    next();
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}