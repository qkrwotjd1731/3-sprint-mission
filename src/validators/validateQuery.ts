import { assert, defaulted, enums, integer, max, min, object, optional, size, string } from 'superstruct';
import { OrderByType } from '../types/queryTypes';
import type { RequestHandler } from 'express';
import type { OffsetQueryReqDto, OffsetQueryDto, CursorQueryReqDto, CursorQueryDto } from '../types/queryTypes';

const OffsetParamsStruct = object({
  offset: defaulted(min(integer(), 0), 0),
  limit: defaulted(min(max(integer(), 100), 1), 10),
  orderBy: optional(enums(['recent'])),
  keyword: optional(size(string(), 1, 30)),
});

const CursorParamsStruct = object({
  cursor: defaulted(min(integer(), 0), 0),
  limit: defaulted(min(max(integer(), 100), 1), 10),
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

    req.validatedQuery = validatedQuery;
    next();
  } catch (err) {
    next(err);
  }
};