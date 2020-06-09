import _ from "lodash";
import faker from "faker";

import { Metadata, Response } from "../../src";

describe("Response", () => {
  const url = faker.internet.url();
  const headers = { "Content-Type": "application/json" };
  const body = { username: faker.internet.userName() };
  const redirected = faker.random.boolean();
  const metadata = { title: faker.lorem.paragraph() };

  describe("constructor", () => {
    it("should init with properties successfully", () => {
      const response = new Response(url, headers, body, redirected, metadata);

      expect(_.get(response, "url")).toBe(url);
      expect(_.get(response, "headers")).toEqual(new Metadata(headers));
      expect(_.get(response, "body")).toEqual(body);
      expect(_.get(response, "redirected")).toBe(redirected);
      expect(_.get(response, "metadata")).toEqual(new Metadata(metadata));
    });

    it("should init without properties as well", () => {
      const response = new Response();

      expect(_.get(response, "url")).toBe("");
      expect(_.get(response, "headers")).toEqual(new Metadata());
      expect(_.get(response, "body")).toBeUndefined();
      expect(_.get(response, "redirected")).toBe(false);
      expect(_.get(response, "metadata")).toEqual(new Metadata());
    });
  });

  describe("snapshot", () => {
    it("should return snapshot of response succesfully", () => {
      const response = new Response(url, headers, body, redirected, metadata);

      expect(response.snapshot()).toEqual({
        url,
        headers,
        body,
        redirected,
        metadata,
      });
    });
  });

  describe("toObject", () => {
    it("should return object of response succesfully", () => {
      const response = new Response(url, headers, body, redirected, metadata);

      expect(response.toObject()).toEqual({
        url,
        headers,
        redirected,
        metadata,
      });
    });
  });

  describe("use", () => {
    it("should use configs successfully", () => {
      const response = new Response();
      response.use({
        url,
        headers,
        body,
        redirected,
        metadata,
      });
      response.use({});

      expect(response.snapshot()).toEqual({
        url,
        headers,
        body,
        redirected,
        metadata,
      });
    });

    it("only allow override url and body once", () => {
      const response = new Response();
      response.use({
        url,
        headers,
        body,
        redirected,
        metadata,
      });
      response.use({
        url: faker.internet.url(),
        body: faker.lorem.paragraphs(),
      });

      expect(response.snapshot()).toEqual({
        url,
        headers,
        body,
        redirected,
        metadata,
      });
    });
  });
});
