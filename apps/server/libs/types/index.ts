export type Nullable<T> = T | null;

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationMetaResponse {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMetaResponse;
}
