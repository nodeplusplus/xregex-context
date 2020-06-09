import { nanoid } from "nanoid";
import _ from "lodash";

import {
  IXContext,
  IXContextSnapshot,
  IXContextError,
  IRequest,
  IResponse,
  IMetadata,
  IXContextMetadataSnapshot,
  IXContextObject,
  DeepPartial,
  IPagination,
} from "../types";
import { Request } from "../Request";
import { Response } from "../Response";
import { Pagination } from "../Pagination";
import { XContextMetadata } from "./Metadata";

export class XContext<P = any, I = any> implements IXContext<P, I> {
  public readonly payload: P;
  public readonly id: string;
  public readonly request: IRequest;
  public readonly response: IResponse;
  public readonly metadata: IMetadata<IXContextMetadataSnapshot>;
  public readonly pagination: IPagination;
  public readonly prev?: Readonly<IXContextObject>;

  public readonly items: I[] = [];
  private error?: IXContextError;

  constructor(
    payload: P,
    id?: string,
    request?: IRequest,
    response?: IResponse,
    metadata?: IMetadata<IXContextMetadataSnapshot>,
    pagination?: IPagination,
    prev?: IXContextObject
  ) {
    this.payload = Object.isFrozen(payload) ? payload : Object.freeze(payload);
    this.id = id || nanoid();
    this.request = request || new Request();
    this.response = response || new Response();
    this.metadata = metadata || new XContextMetadata();
    this.pagination = pagination || new Pagination();
    this.prev = prev && Object.freeze(prev);
  }

  public next() {
    // drop parent-child chain of previous value
    const prev = this.toObject();
    // ALWAYS call toObject first to get current props of context
    const metadata = this.metadata.next();
    const pagination = this.pagination.next();

    const context = new XContext(
      this.payload,
      this.id,
      new Request(),
      new Response(),
      metadata,
      pagination,
      prev
    );

    // Make sure error will still exist in next context
    if (this.error) context.setError(this.error);
    return context;
  }

  public clone(payload?: P) {
    const context = new XContext(
      payload || this.payload,
      this.id,
      this.request,
      this.response,
      this.metadata,
      this.pagination,
      this.prev
    );

    // Make sure error will still exist in cloned context
    if (this.error) context.setError(this.error);
    return context;
  }

  public use(props?: DeepPartial<IXContextSnapshot>) {
    if (!props) return;
    // dont allow modify both id and payload
    if (props.request) this.request.use(props.request);
    if (props.response) this.response.use(props.response);
    if (props.metadata) this.metadata.use(props.metadata);
    if (props.pagination) this.pagination.use(props.pagination);
    // also dont allow override both .prev and .error
  }

  public snapshot() {
    const snapshot: IXContextSnapshot = {
      ...this.toObject(),
      prev: this.prev,
      items: this.items,
    };
    return snapshot;
  }

  public toObject() {
    const object: IXContextObject = {
      payload: this.payload,
      id: this.id,
      request: this.request.toObject(),
      response: this.response.toObject(),
      metadata: this.metadata.snapshot(),
      pagination: this.pagination.snapshot(),
    };
    if (this.error) object.error = this.error;
    return object;
  }

  public toString() {
    return JSON.stringify(this.toObject());
  }

  public setError(error: Error) {
    this.error = _.pick(error, ["name", "message", "stack"]);
  }

  public hasError() {
    return Boolean(this.error);
  }
}
