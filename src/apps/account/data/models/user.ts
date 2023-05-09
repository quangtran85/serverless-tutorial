import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { BaseModel } from '@shared/data/mongodb/base.model';

export type Gender = 'Female' | 'Male' | 'Other';

@modelOptions({ schemaOptions: { collection: 'users' } })
export class User extends BaseModel<User> {
  @prop({ required: true, limit: 50 })
  public firstName: string;

  @prop({ required: true, limit: 50 })
  public lastName: string;

  @prop({ required: true, limit: 100 })
  public email: string;

  @prop({ required: false, default: 'Other' })
  public gender?: Gender;

  toEntity(user = new User()): User {
    user = this.toBaseEntity(user);
    user.firstName = this.firstName;
    user.lastName = this.lastName;
    user.email = this.email;
    user.gender = this.gender;
    return user;
  }
}

export const userDataModel = getModelForClass(User);
