import { GenericObject, IMetadata } from ".";

export interface IResponseObject {
  url: string;
  headers: GenericObject;
  redirected: boolean;
  metadata: GenericObject;
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
