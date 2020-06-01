import { IPagination, IPaginationSnapshot } from "./types";

export class Pagination implements IPagination {
  private page: number;
  private limit: number;

  constructor(page?: number, limit?: number) {
    this.page = page || 0;
    this.limit = limit || 100;
  }

  public snapshot() {
    const offset = (this.page - 1) * this.limit;
    return {
      page: this.page,
      limit: this.limit,
      offset: offset > 0 ? offset : 0,
    };
  }

  public use(pagination: Partial<IPaginationSnapshot>) {
    if (pagination.page) this.page = pagination.page;
    if (pagination.limit) this.limit = pagination.limit;
  }

  public next() {
    const page = this.page + 1;
    const limit = this.limit;

    return new Pagination(page, limit);
  }
}
