import { assert, object, size, string } from 'superstruct';
import { Email } from '../utils/structs.js';

const CreateUserStruct = object({
  email: Email,
  nickname: size(string(), 1, 30),
  password: size(string(), 1, 30),
});

const LoginStruct = object({
  email: Email,
  password: size(string(), 1, 30),
});

export function validateCreateUser(req, res, next) {
  try {
    assert(req.body, CreateUserStruct);
    next();
  } catch (err) {
    next(err);
  }
}

export function validateLogin(req, res, next) {
  try {
    assert(req.body, LoginStruct);
    next();
  } catch (err) {
    next(err);
  }
}