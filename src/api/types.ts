export type DefaultResponse<T> = {
  status: string;
  data: PaginatedResponse<T> | SingleResponse<T>;
  message?: string;
};

export type SingleResponse<T> = T;

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pageCount: number;
  };
};