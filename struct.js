import { array, coerce, integer, min, object, size, string } from 'superstruct';

export const CreateProductStruct = object({
  name: coerce(size(string(), 1, 30), string(), (value) => value.trim()),
  description: size(string(), 1, 1000),
  price: min(integer(), 0),
  tags: array(size(string(), 1, 20)),
});
