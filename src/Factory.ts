import {
  IRequestSnapshot,
  IPaginationSnapshot,
  DeepPartial,
  IContextSnapshot,
} from "./types";
import { Request } from "./Request";
import { Response } from "./Response";
import { Pagination } from "./Pagination";
import { Context, ContextMetadata } from "./Context";

export class Factory {
  public static createRequest(request?: Partial<IRequestSnapshot>) {
    const props: Partial<IRequestSnapshot> = { ...request };
    return new Request(
      props.url,
      props.method,
      props.headers,
      props.body,
      props.timeout,
      props.metadata
    );
  }

  public static createPagination(pagination?: Partial<IPaginationSnapshot>) {
    const props: Partial<IPaginationSnapshot> = { ...pagination };
    return new Pagination(props.page, props.limit);
  }

  public static createContext(ctx?: DeepPartial<IContextSnapshot>) {
    const props: DeepPartial<IContextSnapshot> = { ...ctx };

    return new Context(
      props.payload || {},
      props.id,
      Factory.createRequest(props.request),
      new Response(),
      new ContextMetadata(props.metadata),
      Factory.createPagination(props.pagination)
    );
  }
}
