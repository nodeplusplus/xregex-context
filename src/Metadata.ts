import { Map as IMmutableMap } from "immutable";

import { GenericObject, IMetadata } from "./types";

export class Metadata<P extends GenericObject> implements IMetadata<P> {
  protected props: IMmutableMap<string, any>;

  constructor(props?: P) {
    this.props = IMmutableMap<any>({ ...props });
  }

  public next() {
    // make sure our metadata was same
    return this;
  }

  public snapshot() {
    return this.props.toObject() as P;
  }

  public use(metadata: GenericObject) {
    const keys = Object.keys(metadata);
    keys.forEach((key) => {
      this.props = this.props.set(key, metadata[key]);
    });
  }

  public get<V = any>(field: string, defaultValue?: any): V {
    if (!this.has(field)) return defaultValue;
    return this.props.get(field);
  }

  public set(field: string, value: any) {
    this.props = this.props.set(field, value);
  }

  public delete(field: string) {
    this.props = this.props.delete(field);
  }

  public has(field: string) {
    const value = this.props.get(field);
    return typeof value !== "undefined";
  }

  public increase(field: string, count = 1) {
    const previous = this.get(field, 0);
    if (!Number.isFinite(previous)) return 0;

    const current = previous + count;
    this.set(field, current);

    return current;
  }

  public decrease(field: string, count = 1) {
    const previous = this.get(field, 0);
    if (!Number.isFinite(previous)) return 0;

    const current = previous - count;
    this.set(field, current);

    return current;
  }
}
