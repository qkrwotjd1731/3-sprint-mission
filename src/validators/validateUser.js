import { assert, object, partial, size, string } from 'superstruct';
import { Url } from '../utils/structs.js';

const UpdateUserStruct = partial(object({
  email: Url,
  nickname: size(string(), 1, 30),
  image: Url,
}));

const UpdatePasswordStruct = object({
  currentPassword: size(string(), 1, 30),
  newPassword: size(string(), 1, 30),
});

export function validateUpdateUser(req, res, next) {
  try {
    assert(req.body, UpdateUserStruct);
    next();
  } catch (err) {
    next(err);
  }
}

export function validateUpdatePassword(req, res, next) {
  try {
    assert(req.body, UpdatePasswordStruct);
    next();
  } catch (err) {
    next(err);
  }
}