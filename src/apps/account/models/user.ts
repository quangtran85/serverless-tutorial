import { BaseModel } from '@shared/data/mongodb/base.model';
import { UserRole } from '@shared/type';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

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

  @prop({ required: true, default: UserRole.CUSTOMER })
  public role: UserRole;

  @prop({ required: true, default: false })
  public isMember: boolean;

  toEntity(user = new User()): User {
    user = this.toBaseEntity(user);
    user.firstName = this.firstName;
    user.lastName = this.lastName;
    user.email = this.email;
    user.postal = this.postal;
    user.role = this.role;
    user.isMember = this.isMember;
    return user;
  }
}

export const userDataModel = getModelForClass(User);
