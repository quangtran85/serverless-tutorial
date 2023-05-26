import { PaginateType } from '@shared/type';
import { ReturnModelType } from '@typegoose/typegoose';
import {
  AggregateOptions,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  SaveOptions,
  Types,
} from 'mongoose';
import { BaseModel } from './base.model';

export type TData<T> = { [Key in keyof T]?: any };
export type PaginatedResult<T> = {
  data: T[];
  pagination: {
    limit: number;
    skip: number;
    total: number;
  };
};

export abstract class BaseRepository<T extends BaseModel<T>> {
  protected model: ReturnModelType<{
    new (...args: any): T;
  }>;

  constructor(
    dataModel: ReturnModelType<{
      new (...args: any): T;
    }>,
  ) {
    this.model = dataModel;
  }

  /**
   * Find objects
   *
   * @param {FilterQuery<T>} filter
   * @param {ProjectionType<T> | undefined} select
   * @param {QueryOptions} options
   * @returns {Promise<T[]>}
   */
  async find(
    filter: FilterQuery<T> = {},
    select?: ProjectionType<T> | undefined,
    options?: QueryOptions,
  ): Promise<T[]> {
    const query = this.model.find(filter, select, options);
    const result = await query.exec();

    return result.map((result) => result.toEntity());
  }

  /**
   * Find one
   *
   * @param {FilterQuery<T>} filter
   * @param {ProjectionType<T> | undefined} select
   * @param {QueryOptions} options
   * @returns {Promise<T[]>}
   */
  async findOne(
    filter: FilterQuery<T> = {},
    select?: ProjectionType<T> | undefined,
    options?: QueryOptions,
  ): Promise<T | undefined> {
    const query = this.model.findOne(filter, select, options);
    const result = await query.exec();

    return result?.toEntity() ?? undefined;
  }

  /**
   * Find and count
   *
   * @param {FilterQuery<T>} filter
   * @param {PaginateType} paginate
   * @param {AggregateOptions} options
   *
   * @returns {Promise<PaginatedResult<T>>}
   */
  async findAndCount(
    filter: FilterQuery<T> = {},
    paginate: PaginateType,
    options?: AggregateOptions,
  ): Promise<PaginatedResult<T>> {
    const result = await this.model
      .aggregate(
        [
          { $match: filter },
          { $sort: paginate?.sort ?? { createdAt: 1 } },
          {
            $facet: {
              metadata: [{ $count: 'total' }],
              docs: [{ $skip: paginate.skip }, { $limit: paginate.limit }],
            },
          },
        ],
        options,
      )
      .project({
        total: { $ifNull: [{ $arrayElemAt: ['$metadata.total', 0] }, 0] },
        docs: 1,
      });

    return {
      data:
        result[0]?.docs.map(
          (item) =>
            ({
              ...item,
              id: item._id.toHexString(),
            } as T),
        ) ?? [],
      pagination: {
        skip: paginate.skip,
        limit: paginate.limit,
        total: result[0]?.total ?? 0,
      },
    };
  }

  /**
   * Get object
   *
   * @param {string} id
   * @returns {Promise<T | undefined>}
   */
  async get(id: string | Types.ObjectId): Promise<T | undefined> {
    const result = await this.model.findById<T>(id);
    return result?.toEntity() ?? undefined;
  }

  /**
   * Create object
   *
   * @param {TData<T>} data
   * @param {SaveOptions} options
   * @returns {Promise<string>}
   */
  async create(data: TData<T>, options?: SaveOptions): Promise<string> {
    const result = await this.model.create([data], options);
    return result && result[0]._id.toHexString();
  }

  /**
   * Create and get object
   *
   * @param {TData<T>} data
   * @param {SaveOptions} options
   * @returns {Promise<T>}
   */
  async createGet(data: TData<T>, options?: SaveOptions): Promise<T> {
    const result = await this.model.create([data], options);
    return result && result[0].toEntity();
  }

  /**
   * Update one row
   *
   * @param {string} id
   * @param {TData<T>} data
   * @param {QueryOptions} options
   *
   * @returns {Promise<boolean>}
   */
  async updateById(
    id: string,
    data: TData<T>,
    options?: QueryOptions,
  ): Promise<boolean> {
    const { modifiedCount } = await this.model.updateOne(
      { _id: new Types.ObjectId(id) },
      data,
      options,
    );

    return modifiedCount === 1;
  }

  /**
   * Update
   *
   * @param {FilterQuery<T>} conditions
   * @param {TData<T>} data
   * @param {QueryOptions} options
   *
   * @returns {Promise<boolean>}
   */
  async update(
    conditions: FilterQuery<T>,
    data: TData<T>,
    options?: QueryOptions,
  ): Promise<boolean> {
    const { modifiedCount } = await this.model.updateMany(
      conditions,
      data,
      options,
    );

    return modifiedCount > 0;
  }
}
