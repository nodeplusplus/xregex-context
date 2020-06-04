import faker from "faker";

import { Factory } from "../../src";

describe("Factory", () => {
  describe("createRequest", () => {
    const url = faker.internet.url();
    const headers = { "Content-Type": "application/json" };
    const body = { username: faker.internet.userName() };
    const timeout = 30000;
    const metadata = { "proxy/id": `${faker.internet.ip()}` };

    it("should create fresh request successfully", () => {
      const request = Factory.createRequest();

      expect(request.snapshot()).toEqual({
        url: "",
        method: "GET",
        headers: {},
        body: undefined,
        timeout: 60000,
        metadata: {},
      });
    });

    it("should create request with properties as well", () => {
      const request = Factory.createRequest({
        url,
        method: "POST",
        headers,
        body,
        timeout,
        metadata,
      });

      expect(request.snapshot()).toEqual({
        url,
        method: "POST",
        headers,
        body,
        timeout,
        metadata,
      });
    });
  });

  describe("createPagination", () => {
    const page = faker.random.number({ min: 2 });
    const limit = faker.random.number({ min: 2 });

    it("should create fresh pagination successfully", () => {
      const pagination = Factory.createPagination();

      expect(pagination.snapshot()).toEqual({
        page: 0,
        limit: 100,
        offset: 0,
      });
    });

    it("should create pagination with properties as well", () => {
      const pagination = Factory.createPagination({ page, limit });

      expect(pagination.snapshot()).toEqual({
        page,
        limit,
        offset: (page - 1) * limit,
      });
    });
  });

  describe("createXContext", () => {
    const payload = {
      url: faker.internet.url(),
      siteName: faker.internet.domainName(),
      siteId: faker.random.uuid(),
    };
    const id = faker.random.uuid();

    it("should create fresh context successfully", () => {
      const context = Factory.createXContext();

      const snapshot = context.snapshot();
      expect(snapshot.payload).toEqual({});
      expect(snapshot.id).toBeTruthy();
      expect(snapshot.request).toBeTruthy();
      expect(snapshot.response).toBeTruthy();
      expect(snapshot.metadata).toBeTruthy();
      expect(snapshot.prev).toBeFalsy();
    });

    it("should create context with properties as well", () => {
      const context = Factory.createXContext({ payload, id });

      const snapshot = context.snapshot();
      expect(snapshot.payload).toEqual(payload);
      expect(snapshot.id).toBe(id);
      expect(snapshot.request).toBeTruthy();
      expect(snapshot.response).toBeTruthy();
      expect(snapshot.metadata).toBeTruthy();
      expect(snapshot.prev).toBeFalsy();
    });
  });
});
