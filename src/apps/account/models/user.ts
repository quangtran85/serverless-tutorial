import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { BaseModel } from '@shared/data/mongodb/base.model';

export type Gender = 'Female' | 'Male' | 'Other';

@modelOptions({ schemaOptions: { collection: 'users' } })
export class User extends BaseModel<User> {
  @prop({ required: true, limit: 100 })
  public username: string;

  @prop({ required: true, limit: 50 })
  public firstName: string;

  @prop({ required: true, limit: 50 })
  public lastName: string;

  @prop({ required: false, limit: 100 })
  public email: string;

  @prop({ required: false, limit: 10 })
  public postal: string;

  @prop({ required: true, default: true })
  public isMember: boolean;

  toEntity(user = new User()): User {
    user = this.toBaseEntity(user);
    user.firstName = this.firstName;
    user.lastName = this.lastName;
    user.email = this.email;
    user.postal = this.postal;
    user.isMember = this.isMember;
    return user;
  }
}

export const userDataModel = getModelForClass(User);
