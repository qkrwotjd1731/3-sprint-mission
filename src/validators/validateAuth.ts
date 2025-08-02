import { assert, object, size, string } from 'superstruct';
import { Email } from '../utils/structs';
import type { RequestHandler } from 'express';

const CreateUserStruct = object({
  email: Email,
  nickname: size(string(), 1, 30),
  password: size(string(), 1, 30),
});

const LoginStruct = object({
  email: Email,
  password: size(string(), 1, 30),
});

export const validateCreateUser: RequestHandler = (req, res, next) => {
  try {
    assert(req.body, CreateUserStruct);
    next();
  } catch (err) {
    next(err);
  }
}

export const validateLogin: RequestHandler = (req, res, next) => {
  try {
    assert(req.body, LoginStruct);
    next();
  } catch (err) {
    next(err);
  }
}