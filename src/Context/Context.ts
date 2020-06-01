import { nanoid } from "nanoid";
import _ from "lodash";

import {
  IContext,
  IRequest,
  IResponse,
  IMetadata,
  IContextSnapshot,
  IContextMetadataSnapshot,
  GenericObject,
  IContextObject,
  DeepPartial,
  IPagination,
} from "../types";
import { Request } from "../Request";
import { Response } from "../Response";
import { Pagination } from "../Pagination";
import { ContextMetadata } from "./Metadata";

export class Context<P = any> implements IContext<P> {
  public readonly payload: P;
  public readonly id: string;
  public readonly request: IRequest;
  public readonly response: IResponse;
  public readonly metadata: IMetadata<IContextMetadataSnapshot>;
  public readonly pagination: IPagination;
  public readonly prev?: Readonly<IContextObject>;

  public readonly items: GenericObject[] = [];
  private error?: { message: string; stack?: string };

  constructor(
    payload: P,
    id?: string,
    request?: IRequest,
    response?: IResponse,
    metadata?: IMetadata<IContextMetadataSnapshot>,
    pagination?: IPagination,
    prev?: IContextObject
  ) {
    this.payload = Object.isFrozen(payload) ? payload : Object.freeze(payload);
    this.id = id || nanoid();
    this.request = request || new Request();
    this.response = response || new Response();
    this.metadata = metadata || new ContextMetadata();
    this.pagination = pagination || new Pagination();
    this.prev = prev && Object.freeze(prev);
  }

  public next() {
    // drop parent-child chain of previous value
    const prev = this.toObject();
    // ALWAYS call toObject first to get current props of context
    const metadata = this.metadata.next();
    const pagination = this.pagination.next();

    return new Context(
      this.payload,
      this.id,
      new Request(),
      new Response(),
      metadata,
      pagination,
      prev
    );
  }

  public clone(payload?: P) {
    return new Context(
      payload || this.payload,
      this.id,
      this.request,
      this.response,
      this.metadata,
      this.pagination,
      this.prev
    );
  }

  public use(props?: DeepPartial<IContextSnapshot>) {
    if (!props) return;
    // dont allow modify both id and payload
    if (props.request) this.request.use(props.request);
    if (props.response) this.response.use(props.response);
    if (props.metadata) this.metadata.use(props.metadata);
    if (props.pagination) this.pagination.use(props.pagination);
  }

  public snapshot() {
    const snapshot: IContextSnapshot = {
      ...this.toObject(),
      prev: this.prev,
      items: this.items,
    };
    return snapshot;
  }

  public toObject() {
    const object: IContextObject = {
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
    this.error = _.pick(error, ["message", "stack"]);
  }

  public hasError() {
    return Boolean(this.error);
  }
}
