import _ from "lodash";
import faker from "faker";

import { Metadata, Request } from "../../src";

describe("Request", () => {
  const url = faker.internet.url();
  const headers = { "Content-Type": "application/json" };
  const body = { username: faker.internet.userName() };
  const timeout = 30000;
  const metadata = { "proxy/id": `${faker.internet.ip()}` };

  describe("constructor", () => {
    it("should init with properties successfully", () => {
      const request = new Request(
        url,
        "POST",
        headers,
        body,
        timeout,
        metadata
      );

      expect(_.get(request, "url")).toBe(url);
      expect(_.get(request, "method")).toBe("POST");
      expect(_.get(request, "headers")).toEqual(new Metadata(headers));
      expect(_.get(request, "body")).toEqual(body);
      expect(_.get(request, "timeout")).toBe(timeout);
      expect(_.get(request, "metadata")).toEqual(new Metadata(metadata));
    });

    it("should init without properties as well", () => {
      const request = new Request();

      expect(_.get(request, "url")).toBe("");
      expect(_.get(request, "method")).toBe("GET");
      expect(_.get(request, "headers")).toEqual(new Metadata());
      expect(_.get(request, "body")).toBeUndefined();
      expect(_.get(request, "timeout")).toBe(60000);
      expect(_.get(request, "metadata")).toEqual(new Metadata());
    });
  });

  describe("snapshot", () => {
    it("should return snapshot of request succesfully", () => {
      const request = new Request(
        url,
        "POST",
        headers,
        body,
        timeout,
        metadata
      );

      expect(request.snapshot()).toEqual({
        url,
        method: "POST",
        body,
        headers,
        timeout,
        metadata,
      });
    });
  });

  describe("toObject", () => {
    it("should return object of request succesfully", () => {
      const request = new Request(
        url,
        "POST",
        headers,
        body,
        timeout,
        metadata
      );

      expect(request.toObject()).toEqual({
        url,
        method: "POST",
        body,
        headers,
        timeout,
        metadata,
      });
    });
  });

  describe("use", () => {
    it("should use configs successfully", () => {
      const request = new Request();
      request.use({
        url,
        method: "POST",
        headers,
        body,
        timeout,
        metadata,
      });
      request.use({});

      expect(request.toObject()).toEqual({
        url,
        method: "POST",
        body,
        headers,
        timeout,
        metadata,
      });
    });
  });
});
