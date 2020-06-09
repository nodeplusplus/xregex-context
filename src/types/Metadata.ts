import { GenericObject } from "./Common";

export interface IMetadata<O = IMetadataObject, S = IMetadataSnapshot> {
  get<V = any>(field: string, defaultValue?: any): V;
  set(field: string, value: any): void;
  delete(field: string): void;
  has(field: string): boolean;
  snapshot(): S;
  next(): IMetadata<O, S>;
  use(metadata: Partial<O>): void;
}

export interface IMetadataObject extends GenericObject {}

export interface IMetadataSnapshot extends IMetadataObject {}
