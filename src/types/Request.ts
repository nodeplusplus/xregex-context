import { GenericObject, IMetadata } from ".";

export interface IRequestObject {
  url: string;
  method: string;
  headers: GenericObject;
  body: any;
  timeout: number;
  metadata: GenericObject;
}

export interface IRequestSnapshot extends IRequestObject {}

export interface IRequest {
  metadata: IMetadata;

  use(request: Partial<IRequestSnapshot>): void;
  snapshot(): IRequestSnapshot;
  toObject(): IRequestObject;
}
