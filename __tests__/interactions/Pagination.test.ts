import faker from "faker";
import _ from "lodash";

import { Pagination } from "../../src";

describe("Pagination", () => {
  const page = faker.random.number({ min: 2 });
  const limit = faker.random.number({ min: 2 });

  describe("constructor", () => {
    it("should init with properties successfully", () => {
      const pagination = new Pagination(page, limit);

      expect(_.get(pagination, "page")).toBe(page);
      expect(_.get(pagination, "limit")).toBe(limit);
    });

    it("should init without properties as well", () => {
      const pagination = new Pagination();

      expect(_.get(pagination, "page")).toBe(0);
      expect(_.get(pagination, "limit")).toBe(100);
    });
  });

  describe("snapshot", () => {
    it("should return snapshot succesfully", () => {
      const pagination = new Pagination(page, limit);

      expect(pagination.snapshot()).toEqual({
        page,
        limit,
        offset: (page - 1) * limit,
      });
    });

    it("should make sure offset always greater than or equal ZERO", () => {
      const pagination = new Pagination();

      expect(pagination.snapshot()).toEqual({ page: 0, limit: 100, offset: 0 });
    });
  });

  describe("use", () => {
    it("should update properties of they are truthy", () => {
      const pagination = new Pagination();
      pagination.use({ page, limit });

      expect(pagination.snapshot()).toEqual({
        page,
        limit,
        offset: (page - 1) * limit,
      });
    });

    it("should do notthing if properties weren't truthy", () => {
      const pagination = new Pagination(page, limit);
      pagination.use({});

      expect(pagination.snapshot()).toEqual({
        page,
        limit,
        offset: (page - 1) * limit,
      });
    });
  });

  describe("next", () => {
    it("should calculate properties for next actions", () => {
      const pagination = new Pagination();

      expect(pagination.next().snapshot()).toEqual({
        page: 1,
        limit: 100,
        offset: 0,
      });
      expect(pagination.next().next().snapshot()).toEqual({
        page: 2,
        limit: 100,
        offset: 100,
      });
    });
  });
});
