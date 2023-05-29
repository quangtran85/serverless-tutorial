import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { BaseModel } from '@shared/data/mongodb/base.model';

export type Gender = 'Female' | 'Male' | 'Other';

@modelOptions({ schemaOptions: { collection: 'users' } })
export class User extends BaseModel<User> {
  @prop({ required: true, limit: 100 })
  public username: string;

  @prop({ required: true, limit: 50 })
  public password: string;

  @prop({ required: false, limit: 100 })
  public email: string;

  @prop({ required: true, limit: 100 })
  public address: string;

  @prop({ required: true, limit: 50 })
  public city: string;

  @prop({ required: true, limit: 50 })
  public state: string;

  @prop({ required: true, limit: 50 })
  public zipCode: string;

  @prop({ default: false })
  public isMember: boolean;

  toEntity(user = new User()): User {
    user = this.toBaseEntity(user);
    user.email = this.email;
    user.password = this.password;
    user.address = this.address;
    user.city = this.city;
    user.state = this.state;
    user.zipCode = this.zipCode;
    user.isMember = this.isMember;
    return user;
  }
}

export const userDataModel = getModelForClass(User);
