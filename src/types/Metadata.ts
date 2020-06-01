import { GenericObject } from "./Common";

export interface IMetadata<P = GenericObject> {
  get<V = any>(field: string, defaultValue?: any): V;
  set(field: string, value: any): void;
  delete(field: string): void;
  snapshot(): P;
  next(): IMetadata<P>;
  use(metadata: Partial<P>): void;
}
