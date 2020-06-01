import _ from "lodash";
import { Map as IMmutableMap } from "immutable";
import faker from "faker";

import { ContextMetadata } from "../../../src";

describe("Context/Metadata", () => {
  describe("constructor", () => {
    it("should init with default property", () => {
      const props = { id: faker.random.uuid() };
      const metadata = new ContextMetadata(props);

      expect(metadata.snapshot()).toEqual({ ...props, round: 0 });
    });
  });

  describe("next", () => {
    it("should update properties for next action", () => {
      const props = { id: faker.random.uuid() };
      const metadata = new ContextMetadata(props);

      expect(metadata.next().snapshot()).toEqual({ ...props, round: 1 });
    });
  });
});
