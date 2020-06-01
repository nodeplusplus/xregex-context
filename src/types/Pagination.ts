export interface IPaginationObject {
  page: number;
  limit: number;
  offset: number;
}

export interface IPaginationSnapshot extends IPaginationObject {}

export interface IPagination {
  use(pagination: Partial<IPaginationSnapshot>): void;
  snapshot(): IPaginationSnapshot;
  next(): IPagination;
}
