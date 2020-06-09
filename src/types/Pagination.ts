export interface IPaginationObject {
  page: number;
  limit: number;
  offset: number;
}

export interface IPaginationSnapshot extends IPaginationObject {}

export interface IPagination {
  use(pagination: Partial<IPaginationObject>): void;
  snapshot(): IPaginationSnapshot;
  toObject(): IPaginationObject;
  next(): IPagination;
}
