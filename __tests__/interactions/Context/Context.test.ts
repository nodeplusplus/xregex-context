import faker from "faker";
import _ from "lodash";

import {
  XContext,
  Request,
  Response,
  Metadata,
  Pagination,
  IXContextMetadataSnapshot,
} from "../../../src";

describe("XContext", () => {
  const payload = {
    url: faker.internet.url(),
    siteName: faker.internet.domainName(),
    siteId: faker.random.uuid(),
  };

  describe("constructor", () => {
    it("should init with default value", () => {
      const context = new XContext(payload);

      const snapshot = context.snapshot();
      expect(snapshot.payload).toEqual(payload);
      expect(snapshot.id).toBeTruthy();
      expect(snapshot.request).toBeTruthy();
      expect(snapshot.response).toBeTruthy();
      expect(snapshot.metadata).toBeTruthy();
      expect(snapshot.prev).toBeFalsy();
    });

    it("should allow init with custom value", () => {
      const id = faker.random.uuid();
      const prev = new XContext(payload, id).toObject();
      const context = new XContext(
        payload,
        prev.id,
        new Request(),
        new Response(),
        new Metadata(),
        new Pagination(),
        prev
      );

      const snapshot = context.snapshot();
      expect(snapshot.id).toBe(id);
      expect(snapshot.request).toEqual(new Request().snapshot());
      expect(snapshot.response).toEqual(new Response().snapshot());
      expect(snapshot.metadata).toEqual(new Metadata().snapshot());
      expect(snapshot.pagination).toEqual(new Pagination().snapshot());

      expect(snapshot.prev).toEqual(prev);
    });
  });

  describe("hasError", () => {
    it("should return error status", () => {
      const context = new XContext(payload);

      expect(context.hasError()).toBe(false);
    });
  });

  describe("setError", () => {
    it("should set error of context successfully", () => {
      const context = new XContext(payload);
      context.setError(new Error("TEST"));

      expect(context.hasError()).toBe(true);
    });
  });

  describe("snapshot", () => {
    it("should return snapshot of context", () => {
      const context = new XContext(payload);
      const snapshot = context.next().snapshot();

      expect(snapshot.payload).toEqual(payload);
      expect(snapshot.id).toBeTruthy();
      expect(snapshot.request).toBeTruthy();
      expect(snapshot.response).toBeTruthy();
      expect(snapshot.metadata).toBeTruthy();
      expect(snapshot.prev).toBeTruthy();
      expect(snapshot.error).toBeFalsy();
    });
  });

  describe("toObject", () => {
    it("should return object without error property", () => {
      const context = new XContext(payload);

      const object = context.toObject();

      expect(object.payload).toEqual(payload);
      expect(object.id).toBeTruthy();
      expect(object.request).toBeTruthy();
      expect(object.response).toBeTruthy();
      expect(object.metadata).toBeTruthy();
      expect(object.prev).toBeFalsy();
      expect(object.error).toBeFalsy();
    });

    it("should return object with error property if error was set", () => {
      const context = new XContext(payload);
      const error = new Error("TEST");
      context.setError(error);

      const object = context.toObject();

      expect(object.payload).toEqual(payload);
      expect(object.id).toBeTruthy();
      expect(object.request).toBeTruthy();
      expect(object.response).toBeTruthy();
      expect(object.metadata).toBeTruthy();
      expect(object.prev).toBeFalsy();
      expect(object.error?.message).toBe(error.message);
    });
  });

  describe("use", () => {
    it("should do nothing if extended properties was falsy", () => {
      const context = new XContext(payload);
      const snapshot = context.snapshot();

      context.use();
      const extendedSnapshot = context.snapshot();

      expect(snapshot).toEqual(extendedSnapshot);
    });

    it("should limit configs could be used", () => {
      const context = new XContext(payload);
      const snapshot = context.snapshot();

      const prev = new XContext(payload).snapshot();
      context.use({ prev } as any);
      const extendedSnapshot = context.snapshot();

      expect(snapshot).toEqual(extendedSnapshot);
      expect(snapshot.prev).toEqual(extendedSnapshot.prev);
    });

    it("should use configs of child components", () => {
      const context = new XContext(payload);
      const snapshot = context.snapshot();

      const request = { url: faker.internet.url() };
      const response = { url: request.url };
      const metadata = { "proxy/quota/id": faker.internet.ip() };
      const pagination = new Pagination(1, 10).snapshot();
      context.use({ request, response, metadata, pagination });
      const extendedXContext = context.snapshot();

      expect(snapshot).not.toEqual(extendedXContext);

      // Request
      const extendedRequest = _.pick(
        extendedXContext.request,
        Object.keys(request)
      );
      expect(extendedRequest).toEqual(request);

      // Response
      const extendedResponse = _.pick(
        extendedXContext.response,
        Object.keys(response)
      );
      expect(extendedResponse).toEqual(response);

      // Metadata
      const extendedMetadata = _.pick(
        extendedXContext.metadata,
        Object.keys(metadata)
      );
      expect(extendedMetadata).toEqual(metadata);

      expect(extendedXContext.pagination).toEqual(pagination);
    });
  });

  describe("next", () => {
    it("should return next instance we need", () => {
      const id = faker.random.uuid();
      const url = faker.internet.url();
      const metadata = new Metadata<IXContextMetadataSnapshot>({ round: 0 });
      const pagination = new Pagination();
      const context = new XContext(
        payload,
        id,
        new Request(url),
        new Response(url),
        metadata,
        pagination
      );
      const snapshot = context.snapshot();
      const contextObject = context.toObject();

      const nextCtx = context.next();
      const nextSnapshot = nextCtx.snapshot();

      expect(nextSnapshot.payload).toBe(snapshot.payload);
      expect(nextSnapshot.id).toBe(snapshot.id);
      // must init new instance of both request and responses
      expect(nextSnapshot.request).toEqual(new Request().snapshot());
      expect(nextSnapshot.response).toEqual(new Response().snapshot());
      // Must use next instance of metadata
      expect(nextSnapshot.metadata).not.toBe(snapshot.metadata);
      expect(nextSnapshot.pagination).not.toBe(snapshot.pagination);
      // Should copy previous properties to next snapshot
      expect(nextSnapshot.prev).toEqual(contextObject);
    });

    it("should not create chain of previous value", () => {
      const context = new XContext(payload);
      const firstCtx = context.next();
      const secondCtx = firstCtx.next();

      const secondXContext = secondCtx.snapshot();

      expect(secondXContext.prev).toBeTruthy();
      expect(
        secondXContext.prev && (secondXContext.prev as any).prev
      ).toBeFalsy();
    });

    it("should copy error to next instance", () => {
      const error = new Error("TEST");
      const context = new XContext(payload);
      context.setError(error);

      const firstCtx = context.next();
      const secondCtx = firstCtx.next();

      expect(firstCtx.snapshot().error).toEqual(context.snapshot().error);
      expect(secondCtx.snapshot().error).toEqual(context.snapshot().error);
    });
  });

  describe("clone", () => {
    it("should return clone of context with SAME payload", () => {
      const context = new XContext(payload);
      const snapshot = context.snapshot();

      const cloneCtx = context.clone();
      const cloneSnapshot = cloneCtx.snapshot();

      expect(cloneSnapshot.payload).toEqual(snapshot.payload);
      expect(snapshot.id).toBe(cloneSnapshot.id);
      expect(snapshot.request).toEqual(cloneSnapshot.request);
      expect(snapshot.response).toEqual(cloneSnapshot.response);
      expect(snapshot.metadata).toEqual(cloneSnapshot.metadata);
      expect(snapshot.prev).toBeFalsy();
    });

    it("should return clone of context with new payload", () => {
      const context = new XContext(payload);
      const snapshot = context.snapshot();

      const newPayload = {
        url: faker.internet.url(),
        siteName: faker.internet.domainName(),
        siteId: faker.random.uuid(),
      };
      const cloneCtx = context.clone(newPayload);
      const cloneSnapshot = cloneCtx.snapshot();

      expect(cloneSnapshot.payload).toEqual(newPayload);
      expect(snapshot.id).toBe(cloneSnapshot.id);
      expect(snapshot.request).toEqual(cloneSnapshot.request);
      expect(snapshot.response).toEqual(cloneSnapshot.response);
      expect(snapshot.metadata).toEqual(cloneSnapshot.metadata);
      expect(snapshot.prev).toBeFalsy();
    });

    it("should copy error to cloned instance", () => {
      const error = new Error("TEST");
      const context = new XContext(payload);
      context.setError(error);

      const cloneCtx = context.clone();

      expect(cloneCtx.snapshot().error).toEqual(context.snapshot().error);
    });
  });

  describe("toString", () => {
    it("should override toString method", () => {
      const context = new XContext(payload);
      expect(String(context)).toBe(JSON.stringify(context.toObject()));
    });
  });
});
