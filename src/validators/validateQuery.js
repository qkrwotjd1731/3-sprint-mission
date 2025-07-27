import { assert, defaulted, enums, number, object, optional, size, string } from 'superstruct';

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

export function validateOffsetParams(req, res, next) {
  try {
    const query = req.query;
    const validatedQuery = {
      offset: query.offset ? parseInt(query.offset) : 0,
      limit: query.limit ? parseInt(query.limit) : 10,
      orderBy: query.orderBy || undefined,
      keyword: query.keyword || undefined,
    };

    assert(validatedQuery, OffsetParamsStruct);
    
    if (validatedQuery.offset < 0) {
      return res.status(400).json({ 
        error: 'offset은 0 이상이어야 합니다.' 
      });
    }
    
    if (validatedQuery.limit < 1 || validatedQuery.limit > 100) {
      return res.status(400).json({ 
        error: 'limit은 1 이상 100 이하여야 합니다.' 
      });
    }

    req.validatedQuery = validatedQuery;
    next();
  } catch (err) {
    next(err);
  }
}

export function validateCursorParams(req, res, next) {
  try {
    const query = req.query;
    const validatedQuery = {
      cursor: query.cursor ? parseInt(query.cursor) : 0,
      limit: query.limit ? parseInt(query.limit) : 10,
    };

    assert(validatedQuery, CursorParamsStruct);

    if (validatedQuery.cursor < 0) {
      return res.status(400).json({ 
        error: 'cursor는 0 이상이어야 합니다.' 
      });
    }

    if (validatedQuery.limit < 1 || validatedQuery.limit > 100) {
      return res.status(400).json({ 
        error: 'limit은 1 이상 100 이하여야 합니다.' 
      });
    }

    req.validatedQuery = validatedQuery;
    next();
  } catch (err) {
    next(err);
  }
}