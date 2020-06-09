import { GenericObject } from "./Common";
import { IMetadata, IMetadataObject } from "./Metadata";

export interface IRequestObject {
  url: string;
  method: string;
  headers: GenericObject;
  body: any;
  timeout: number;
  metadata: IMetadataObject;
}

export interface IRequestSnapshot extends IRequestObject {}

export interface IRequest {
  metadata: IMetadata;

  use(request: Partial<IRequestObject>): void;
  snapshot(): IRequestSnapshot;
  toObject(): IRequestObject;
}
