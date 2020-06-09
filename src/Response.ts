import {
  IResponse,
  IMetadata,
  IResponseSnapshot,
  GenericObject,
} from "./types";
import { Metadata } from "./Metadata";

export class Response implements IResponse {
  private url: string;
  private headers: IMetadata;
  private body: any;
  private redirected: boolean;
  public readonly metadata: IMetadata;

  constructor(
    url?: string,
    headers?: GenericObject,
    body?: any,
    redirected = false,
    metadata?: GenericObject
  ) {
    this.url = url || "";
    this.headers = new Metadata(headers);
    this.body = body;
    this.redirected = redirected;
    this.metadata = new Metadata(metadata);
  }

  public snapshot() {
    return {
      ...this.toObject(),
      body: this.body,
    };
  }

  public toObject() {
    return {
      url: this.url,
      redirected: this.redirected,
      headers: this.headers.snapshot(),
      metadata: this.metadata.snapshot(),
    };
  }

  public use(response: Partial<IResponseSnapshot>) {
    if (response.url && !this.url) this.url = response.url;
    if (response.body && !this.body) this.body = response.body;
    if (typeof response.redirected === "boolean") {
      this.redirected = response.redirected;
    }
    if (response.headers) this.headers.use(response.headers);
    if (response.metadata) this.metadata.use(response.metadata);
  }
}
