import { IRequest, IRequestObject, IMetadata, GenericObject } from "./types";
import { Metadata } from "./Metadata";

export class Request implements IRequest {
  private url: string;
  private method: string;
  private body: any;
  private headers: IMetadata;
  private timeout?: number;
  private json?: boolean;

  public readonly metadata: IMetadata;

  constructor(
    url?: string,
    method?: string,
    headers?: GenericObject,
    body?: any,
    timeout?: number,
    metadata?: GenericObject,
    json?: boolean
  ) {
    this.url = url || "";
    this.method = method || "GET";
    this.headers = new Metadata(headers);
    this.body = body;
    this.timeout = timeout;
    this.json = json;

    this.metadata = new Metadata(metadata);
  }

  public snapshot() {
    return {
      url: this.url,
      method: this.method,
      body: this.body,
      headers: this.headers.snapshot(),
      timeout: this.timeout,
      json: this.json,
      metadata: this.metadata.snapshot(),
    };
  }

  public toObject() {
    return this.snapshot();
  }

  public use(request: Partial<IRequestObject>) {
    if (request.url) this.url = request.url;
    if (request.method) this.method = request.method;
    if (request.headers) this.headers.use(request.headers);
    if (request.body) this.body = request.body;
    if (request.timeout) this.timeout = request.timeout;
    if (request.json) this.json = request.json;

    if (request.metadata) this.metadata.use(request.metadata);
  }
}
