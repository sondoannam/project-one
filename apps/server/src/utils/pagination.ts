import { PaginatedResponse, PaginationParams } from 'libs/types';
import { DEFAULT_PAGE_SIZE } from 'src/constants';

export const getPaginationParams = (params: PaginationParams) => {
  const page = params.page || 1;
  const pageSize = params.pageSize || DEFAULT_PAGE_SIZE;
  const skip = (page - 1) * pageSize;

  return {
    skip,
    take: pageSize,
    page,
    pageSize,
  };
};

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
): PaginatedResponse<T> => {
  return {
    data,
    meta: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};
