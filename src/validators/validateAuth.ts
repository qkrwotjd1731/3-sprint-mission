import { assert, object, size, string } from 'superstruct';
import { Email } from '../utils/structs';
import { HttpError } from '../utils/httpError';
import type { RequestHandler } from 'express';

const CreateUserStruct = object({
  email: Email,
  nickname: size(string(), 1, 30),
  password: size(string(), 8, 30),
});

const LoginStruct = object({
  email: Email,
  password: size(string(), 8, 30),
});

export const validateCreateUser: RequestHandler = (req, res, next) => {
  try {
    assert(req.body, CreateUserStruct);
    next();
  } catch (err: any) {
    // 이메일 관련 에러 (모든 가능한 케이스)
    if (err.path[0] === 'email') {
      return next(new HttpError('잘못된 이메일입니다.', 400));
    }

    // 닉네임 관련 에러
    if (err.path[0] === 'nickname') {
      if (err.value === undefined || err.value === null || err.value.length < 1) {
        return next(new HttpError('닉네임을 입력해주세요.', 400));
      }
      if (err.value.length > 30) {
        return next(new HttpError('닉네임을 30자 이하 입력해주세요.', 400));
      }
    }

    // 비밀번호 관련 에러
    if (err.path[0] === 'password') {
      if (err.value === undefined || err.value === null || err.value.length < 1) {
        return next(new HttpError('비밀번호를 입력해주세요.', 400));
      } else if (err.value.length < 8) {
        return next(new HttpError('비밀번호를 8자 이상 입력해주세요.', 400));
      }
      if (err.value.length > 30) {
        return next(new HttpError('비밀번호를 30자 이하 입력해주세요.', 400));
      }
    }

    // 기타 모든 에러는 기본 처리
    next(err);
  }
};

export const validateLogin: RequestHandler = (req, res, next) => {
  try {
    assert(req.body, LoginStruct);
    next();
  } catch (err: any) {
    // 이메일 관련 에러 (모든 가능한 케이스)
    if (err.path[0] === 'email') {
      return next(new HttpError('잘못된 이메일입니다.', 400));
    }

    // 비밀번호 관련 에러
    if (err.path[0] === 'password') {
      if (err.value === undefined || err.value === null || err.value.length < 1) {
        return next(new HttpError('비밀번호를 입력해주세요.', 400));
      } else if (err.value.length < 8) {
        return next(new HttpError('비밀번호를 8자 이상 입력해주세요.', 400));
      }
      if (err.value.length > 30) {
        return next(new HttpError('비밀번호를 30자 이하 입력해주세요.', 400));
      }
    }

    // 기타 모든 에러는 기본 처리
    next(err);
  }
};
