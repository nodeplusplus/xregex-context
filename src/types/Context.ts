import { GenericObject } from "./Common";
import { IRequest, IRequestObject } from "./Request";
import { IResponse, IResponseObject } from "./Response";
import { IMetadata } from "./Metadata";
import { IPagination, IPaginationSnapshot } from "./Pagination";

export interface IXContextMetadataObject extends GenericObject {
  round: number;
}

export interface IXContextMetadataSnapshot extends IXContextMetadataObject {}

export interface IXContextObject<P = any> {
  id: string;
  payload: P;
  request: IRequestObject;
  response: IResponseObject;
  metadata: Partial<IXContextMetadataSnapshot>;
  pagination: IPaginationSnapshot;
  error?: IXContextError;
}

export interface IXContextSnapshot<P = any, I = any>
  extends IXContextObject<P> {
  items: I[];
  prev?: IXContextObject;
}

export interface IXContext<P = any, I = any> {
  readonly id: string;
  readonly payload: P;
  readonly request: IRequest;
  readonly response: IResponse;
  readonly metadata: IMetadata<IXContextMetadataSnapshot>;
  readonly prev?: Readonly<IXContextObject>;
  readonly items: GenericObject[];
  readonly pagination: IPagination;

  next(): IXContext<P>;
  clone(payload?: P): IXContext<P>;
  use(props?: Partial<IXContextObject>): void;
  snapshot(): IXContextSnapshot<P, I>;
  toObject(): IXContextObject;
  setError(error: Error): void;
  hasError(): boolean;
}

export interface IXContextError extends GenericObject {
  name: string;
  message: string;
  stack?: string;
}
