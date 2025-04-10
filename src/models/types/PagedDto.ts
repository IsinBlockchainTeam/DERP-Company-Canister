export type PagedDto<T> = {
  Items: T[];
  PageSize: number;
  PageNumber: number;
  TotalItems: number;
  TotalPages: number;
};