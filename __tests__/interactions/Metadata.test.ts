import _ from "lodash";
import { Map as IMmutableMap } from "immutable";
import faker from "faker";

import { Metadata, GenericObject } from "../../src";

describe("Metadata", () => {
  describe("constructor", () => {
    it("should init metadata with properties successfully", () => {
      const props = { id: faker.random.uuid() };
      const metadata = new Metadata(props);

      expect(Object.keys(metadata)).toEqual(["props"]);
      expect(IMmutableMap.isMap(_.get(metadata, "props"))).toBeTruthy();
    });

    it("should init without properties as well", () => {
      const metadata = new Metadata();

      expect(Object.keys(metadata)).toEqual(["props"]);
      expect(IMmutableMap.isMap(_.get(metadata, "props"))).toBeTruthy();
    });
  });

  describe("next", () => {
    it("should return current instance for next action", () => {
      const props = { id: faker.random.uuid() };
      const metadata = new Metadata(props);

      expect(metadata.next()).toEqual(metadata);
    });
  });

  describe("snapshot", () => {
    it("should return snapshot of current properties", () => {
      const props = { id: faker.random.uuid() };
      const metadata = new Metadata(props);

      expect(metadata.snapshot()).toEqual(props);
    });
  });

  describe("use", () => {
    it("should set properties succesfully", () => {
      const props = { id: faker.random.uuid() };
      const metadata = new Metadata(props);

      const meta = { id: faker.internet.ip(), name: faker.name.firstName() };
      metadata.use(meta);

      expect(metadata.snapshot()).toEqual(meta);
    });
  });

  describe("get", () => {
    it("should return value of key", () => {
      const props: GenericObject = { id: faker.random.uuid() };
      const metadata = new Metadata(props);

      const key = Object.keys(props)[0];
      expect(metadata.get(key)).toBe(props[key]);
    });

    it("should return default value if value of key is undefined", () => {
      const props: GenericObject = { id: faker.random.uuid() };
      const metadata = new Metadata(props);

      const key = faker.random.word();
      const defaultValue = faker.random.words();
      expect(metadata.get(key, defaultValue)).toBe(defaultValue);
    });
  });

  describe("set", () => {
    it("should set value of key successfully", () => {
      const props: GenericObject = { id: faker.random.uuid() };
      const metadata = new Metadata(props);

      const value = faker.random.uuid();
      metadata.set("id", value);
      expect(metadata.get("id")).toBe(value);
    });
  });

  describe("delete", () => {
    it("should delete property successfully", () => {
      const props: GenericObject = { id: faker.random.uuid() };
      const metadata = new Metadata(props);

      metadata.delete("id");
      expect(metadata.get("id")).toBeUndefined();
    });
  });
});
