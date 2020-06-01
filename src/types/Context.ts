import { GenericObject } from "./Common";
import { IRequest, IRequestSnapshot, IRequestObject } from "./Request";
import { IResponse, IResponseSnapshot, IResponseObject } from "./Response";
import { IMetadata } from "./Metadata";
import { IPagination, IPaginationSnapshot } from "./Pagination";

export interface IContextMetadataObject extends GenericObject {
  round: number;
}

export interface IContextMetadataSnapshot extends IContextMetadataObject {}

export interface IContextObject<P = any> {
  id: string;
  payload: P;
  request: IRequestObject;
  response: IResponseObject;
  metadata: Partial<IContextMetadataSnapshot>;
  pagination: IPaginationSnapshot;
  prev?: IContextObject;
  error?: { message: string; stack?: string };
}

export interface IContextSnapshot<P = any> extends IContextObject<P> {
  items: GenericObject[];
}

export interface IContext<P = any> {
  readonly id: string;
  readonly payload: P;
  readonly request: IRequest;
  readonly response: IResponse;
  readonly metadata: IMetadata<IContextMetadataSnapshot>;
  readonly prev?: Readonly<IContextObject>;
  readonly items: GenericObject[];
  readonly pagination: IPagination;

  next(): IContext<P>;
  clone(payload?: P): IContext<P>;
  use(props?: Partial<IContextSnapshot>): void;
  snapshot(): IContextSnapshot;
  toObject(): IContextObject;
  setError(error: Error): void;
  hasError(): boolean;
}
