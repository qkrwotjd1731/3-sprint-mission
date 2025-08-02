import { assert, defaulted, enums, number, object, optional, size, string } from 'superstruct';
import { RequestHandler } from 'express';
import { HttpError } from '../utils/httpError';
import { OffsetQueryReqDto, OffsetQueryDto, CursorQueryReqDto, CursorQueryDto, OrderByType } from '../types/queryTypes';

const OffsetParamsStruct = object({
  offset: defaulted(number(), 0),
  limit: defaulted(number(), 10),
  orderBy: optional(enums(['recent'])),
  keyword: optional(size(string(), 1, 30)),
});

const CursorParamsStruct = object({
  cursor: defaulted(number(), 0),
  limit: defaulted(number(), 10),
});

// orderBy 파싱 (확장성 고려)
const parseOrderBy = (orderBy?: string): OrderByType | undefined => {
  switch (orderBy) {
    case 'recent':
      return OrderByType.Recent;
    default:
      return undefined;
  }
}

export const validateOffsetParams: RequestHandler = (req, res, next) => {
  try {
    const query: OffsetQueryReqDto = req.query;
    const validatedQuery: OffsetQueryDto = {
      offset: query.offset ? parseInt(query.offset) : 0,
      limit: query.limit ? parseInt(query.limit) : 10,
      orderBy: parseOrderBy(query.orderBy),
      keyword: query.keyword || undefined,
    };

    assert(validatedQuery, OffsetParamsStruct);
    
    if (validatedQuery.offset < 0) {
      throw new HttpError('offset은 0 이상이어야 합니다.', 400);
    }
    
    if (validatedQuery.limit < 1 || validatedQuery.limit > 100) {
      throw new HttpError('limit은 1 이상 100 이하여야 합니다.', 400);
    }

    req.validatedQuery = validatedQuery;
    next();
  } catch (err) {
    next(err);
  }
};

export const validateCursorParams: RequestHandler = (req, res, next) => {
  try {
    const query: CursorQueryReqDto = req.query;
    const validatedQuery: CursorQueryDto = {
      cursor: query.cursor ? parseInt(query.cursor) : 0,
      limit: query.limit ? parseInt(query.limit) : 10,
    };

    assert(validatedQuery, CursorParamsStruct);

    if (validatedQuery.cursor < 0) {
      throw new HttpError('cursor는 0 이상이어야 합니다.', 400);
    }

    if (validatedQuery.limit < 1 || validatedQuery.limit > 100) {
      throw new HttpError('limit은 1 이상 100 이하여야 합니다.', 400);
    }

    req.validatedQuery = validatedQuery;
    next();
  } catch (err) {
    next(err);
  }
};