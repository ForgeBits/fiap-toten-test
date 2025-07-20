import { PaginationMeta } from 'src/core/domain/dtos/common/pagination.query.db.interface';

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

type PaginationMetaResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};

export class PaginationMapper {
  static mappedPaginationResults<T>({
    data,
    meta,
  }: PaginationMetaResponse<T>): PaginatedResponse<T> {
    return {
      data,
      meta,
    };
  }
}
