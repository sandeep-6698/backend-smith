interface IResponse {
  success: boolean;
  message?: string;
  data: object | null | any;
}

export type ErrorResponse = IResponse & {
  error_code: number;
  code?: string;
};

export const createResponse = (
  data: IResponse["data"],
  message?: string
): IResponse => {
  return { data, message, success: true };
};

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> => {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};
