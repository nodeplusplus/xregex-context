import { IRequest, IRequestSnapshot, IMetadata, GenericObject } from "./types";
import { Metadata } from "./Metadata";

export class Request implements IRequest {
  private url: string;
  private method: string;
  private body: any;
  private headers: IMetadata;
  private timeout: number;

  public readonly metadata: IMetadata;

  constructor(
    url?: string,
    method?: string,
    headers?: GenericObject,
    body?: any,
    timeout?: number,
    metadata?: GenericObject
  ) {
    this.url = url || "";
    this.method = method || "GET";
    this.headers = new Metadata(headers);
    this.body = body;
    this.timeout = timeout || 60000;

    this.metadata = new Metadata(metadata);
  }

  public snapshot() {
    return {
      url: this.url,
      method: this.method,
      body: this.body,
      headers: this.headers.snapshot(),
      timeout: this.timeout,
      metadata: this.metadata.snapshot(),
    };
  }

  public toObject() {
    return this.snapshot();
  }

  public use(request: Partial<IRequestSnapshot>) {
    if (request.url) this.url = request.url;
    if (request.method) this.method = request.method;
    if (request.headers) this.headers.use(request.headers);
    if (request.body) this.body = request.body;
    if (request.timeout) this.timeout = request.timeout;

    if (request.metadata) this.metadata.use(request.metadata);
  }
}
