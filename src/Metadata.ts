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
    const prop = this.props.get(field);
    return typeof prop !== "undefined" ? prop : defaultValue;
  }

  public set(field: string, value: any) {
    this.props = this.props.set(field, value);
  }

  public delete(field: string) {
    this.props = this.props.delete(field);
  }
}