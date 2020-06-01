export interface GenericObject {
  [name: string]: any;
}

export type DeepPartial<T = any> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;
