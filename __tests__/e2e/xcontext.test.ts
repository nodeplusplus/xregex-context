import faker from "faker";
import _ from "lodash";

import {
  GenericObject,
  IXContextObject,
  IXContextSnapshot,
  XContext,
  Pagination,
  Request,
  Response,
} from "../../src";

describe("xregex-context", () => {
  const payload = {
    url: faker.internet.url(),
    siteName: faker.internet.domainName(),
    siteId: faker.random.uuid(),
  };

  describe("simple flow", () => {
    let ctx = new XContext(payload);
    let snapshot: IXContextSnapshot;
    let prev: IXContextObject;

    it("should use some configs and use default for remain", () => {
      const configs = { request: { url: faker.internet.url() } };
      ctx.use(configs);

      snapshot = ctx.snapshot();
      expect(snapshot.request).toEqual({
        ...new Request().snapshot(),
        ...configs.request,
      });
      expect(snapshot.response).toEqual(new Response().snapshot());
      expect(snapshot.metadata).toEqual({ round: 0 });
      expect(snapshot.pagination).toEqual(new Pagination().snapshot());

      expect(snapshot.prev).toBeFalsy();
    });

    it("should return next instance we need", () => {
      prev = ctx.toObject();
      ctx = ctx.next();
      snapshot = ctx.snapshot();

      // make sure we init new context
      expect(prev).not.toEqual(snapshot);

      expect(snapshot.request).toEqual(new Request().snapshot());
      expect(snapshot.response).toEqual(new Response().snapshot());
      // next round and pagination
      expect(snapshot.metadata).toEqual({ round: 1 });
      expect(snapshot.pagination).toEqual(new Pagination().next().snapshot());

      expect(snapshot.prev).toEqual(prev);
    });

    it("should only store 1 level of previous state", () => {
      prev = ctx.toObject();
      ctx = ctx.next();
      snapshot = ctx.snapshot();

      // make sure we init new context
      expect(prev).not.toEqual(snapshot);

      expect(snapshot.request).toEqual(new Request().snapshot());
      expect(snapshot.response).toEqual(new Response().snapshot());
      // next round and pagination
      expect(snapshot.metadata).toEqual({ round: 2 });
      expect(snapshot.pagination).toEqual(
        new Pagination().next().next().snapshot()
      );

      expect(snapshot.prev).toEqual(prev);
      expect((snapshot.prev as any).prev).toBeFalsy();
    });
  });

  describe("crawler flow", () => {
    const url = "https://example.com";
    const userAgentName = "user-agent/id";
    const userAgentId = "d89a5df993c1338c5235193f56aa2992";
    const proxyName = "proxy/id";
    const proxyId = "127.0.0.1";
    const ctx = new XContext(payload);

    let metadata: GenericObject = {};

    beforeAll(() => {
      ctx.use({ request: { url } });
    });

    it("should inject user agent succssfully", () => {
      const headers = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:76.0) Gecko/20100101 Firefox/76.0",
      };
      metadata = { ...metadata, [userAgentName]: userAgentId };
      ctx.request.use({ url, headers, metadata });

      const context = ctx.snapshot();
      expect(context.request.headers).toEqual(headers);
      expect(context.request.metadata).toEqual(metadata);
    });

    it("should inject proxy as well", () => {
      metadata = {
        ...metadata,
        proxy: `http://${proxyId}:8080`,
        [proxyName]: proxyId,
      };
      ctx.request.use({ metadata });

      const context = ctx.snapshot();
      expect(context.request.metadata).toEqual(metadata);
    });

    it("should remove ids of both user agent and proxy successfully", () => {
      ctx.request.metadata.delete(userAgentName);
      ctx.request.metadata.delete(proxyName);

      const context = ctx.snapshot();
      expect(context.request.metadata[userAgentName]).toBeFalsy();
      expect(context.request.metadata[proxyName]).toBeFalsy();
    });

    it("should return object WITHOUT some values of request an response", () => {
      const ctxValues = ctx.toObject();

      expect((ctxValues.request as any).body).toBeFalsy();
      expect((ctxValues.response as any).body).toBeFalsy();
    });
  });
});
