import { GenericObject } from "./Common";
import { IMetadata, IMetadataObject } from "./Metadata";

export interface IResponseObject {
  url: string;
  headers: GenericObject;
  redirected: boolean;
  metadata: IMetadataObject;
}

export interface IResponseSnapshot extends IResponseObject {
  body: any;
}

export interface IResponse {
  metadata: IMetadata;

  use(response: Partial<IResponseSnapshot>): void;
  snapshot(): IResponseSnapshot;
  toObject(): IResponseObject;
}
