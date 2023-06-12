export type SortType = Record<string, 1 | -1>;
export type PaginateType = {
  limit: number;
  skip: number;
  sort: SortType;
};

export type GetResourcesInput = PaginateType;

export type ResourceOutput = {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PaginateOutput = {
  total: number;
  limit: number;
  skip: number;
};

export type ResourceDataOutput<T> = {
  data: T;
};

export declare type ResourcesPaginateOutput<T> = {
  pagination?: PaginateOutput;
} & ResourceDataOutput<T[]>;

export enum UserRole {
  SYSTEM = 'system',
  MANAGER = 'manager',
  CUSTOMER = 'customer',
  GUEST = 'guest',
}
