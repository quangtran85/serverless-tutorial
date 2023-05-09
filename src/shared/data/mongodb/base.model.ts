import { Types } from 'mongoose';
import { defaultClasses } from '@typegoose/typegoose';

export abstract class BaseModel<T> extends defaultClasses.TimeStamps {
  public _id: Types.ObjectId;
  public id: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  abstract toEntity(): T;
  toBaseEntity(entity: any): T {
    entity.id = this._id.toHexString();
    entity.createdAt = this.createdAt;
    entity.updatedAt = this.updatedAt;
    return entity;
  }
}
