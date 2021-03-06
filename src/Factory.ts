import {
  IRequestSnapshot,
  IPaginationSnapshot,
  DeepPartial,
  IXContextSnapshot,
} from "./types";
import { Request } from "./Request";
import { Response } from "./Response";
import { Pagination } from "./Pagination";
import { XContext, XContextMetadata } from "./Context";

export class Factory {
  public static createRequest(request?: Partial<IRequestSnapshot>) {
    const props: Partial<IRequestSnapshot> = { ...request };
    return new Request(
      props.url,
      props.method,
      props.headers,
      props.body,
      props.timeout,
      props.metadata,
      props.json
    );
  }

  public static createPagination(pagination?: Partial<IPaginationSnapshot>) {
    const props: Partial<IPaginationSnapshot> = { ...pagination };
    return new Pagination(props.page, props.limit);
  }

  public static createXContext(ctx?: DeepPartial<IXContextSnapshot>) {
    const props: DeepPartial<IXContextSnapshot> = { ...ctx };

    return new XContext(
      props.payload || {},
      props.id,
      Factory.createRequest(props.request),
      new Response(),
      new XContextMetadata(props.metadata),
      Factory.createPagination(props.pagination)
    );
  }
}
