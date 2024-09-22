export class ResponsePagination<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
}
