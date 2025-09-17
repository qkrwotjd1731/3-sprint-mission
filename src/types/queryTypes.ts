export enum OrderByType {
  Recent = 'recent',
}

export interface OffsetQueryReqDto {
  offset?: string;
  limit?: string;
  orderBy?: string;
  keyword?: string;
}

export interface OffsetQueryDto {
  offset: number;
  limit: number;
  orderBy?: OrderByType;
  keyword?: string;
}

export interface CursorQueryReqDto {
  cursor?: string;
  limit?: string;
}

export interface CursorQueryDto {
  cursor: number;
  limit: number;
}
