export const DEFAULT_PAGE_SIZE = 10;

type MapPaginationParams = {
  total: number;
  pageSize: number;
  pageNumber: number;
};

export const mapPagination = (params: MapPaginationParams) => {
  const { total, pageSize, pageNumber } = params;
  const totalPages = Math.ceil(total / pageSize);

  return {
    pageNumber: Number(pageNumber),
    pageSize: Number(pageSize),
    totalPages: Number(totalPages),
    lastPage: Number(pageNumber) === totalPages,
    firstPage: Number(pageNumber) === 1,
  };
};
