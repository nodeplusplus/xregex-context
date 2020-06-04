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
  prev?: IXContextObject;
  error?: { message: string; stack?: string };
}

export interface IXContextSnapshot<P = any> extends IXContextObject<P> {
  items: GenericObject[];
}

export interface IXContext<P = any> {
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
  use(props?: Partial<IXContextSnapshot>): void;
  snapshot(): IXContextSnapshot;
  toObject(): IXContextObject;
  setError(error: Error): void;
  hasError(): boolean;
}
