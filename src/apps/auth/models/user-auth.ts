import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { BaseModel } from '@shared/data/mongodb/base.model';
import { UserRole } from '@shared/type';

@modelOptions({ schemaOptions: { collection: 'user-auth' } })
export class UserAuth extends BaseModel<UserAuth> {
  @prop({ required: true })
  public userId: string;

  @prop({ required: true })
  public password: string;

  @prop({ required: true })
  public role: UserRole;

  @prop({ required: true })
  public username: string;

  toEntity(userAuth = new UserAuth()): UserAuth {
    userAuth = this.toBaseEntity(userAuth);
    userAuth.userId = this.userId;
    userAuth.role = this.role;
    userAuth.password = this.password;
    userAuth.username = this.username;
    return userAuth;
  }
}

export const userAuthDataModel = getModelForClass(UserAuth);
