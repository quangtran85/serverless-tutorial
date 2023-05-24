export type SortType = Record<string, 1 | -1>;

export type PaginateType = {
  limit: number;
  skip: number;
  sort: SortType;
};

export type GetResourcesInput = PaginateType;

export type ResourceOuput = {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PaginateOuput = {
  total: number;
  limit: number;
  skip: number;
};

export type ResourceDataOutput<T> = {
  data: T;
};

export declare type ResourcesPaginateOuput<T> = {
  pagination?: PaginateOuput;
} & ResourceDataOutput<T[]>;

export enum UserRole {
  SYSTEM = 'system',
  MANAGER = 'manager',
  CUSTOMER = 'customer',
  GUEST = 'guest',
}
