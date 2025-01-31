export interface Pagination<T> {
  data: Array<T>;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    lastPage: boolean;
    firstPage: boolean;
  };
}
