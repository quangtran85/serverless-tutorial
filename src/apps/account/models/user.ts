import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { BaseModel } from '@shared/data/mongodb/base.model';

@modelOptions({ schemaOptions: { collection: 'users' } })
export class User extends BaseModel<User> {
  @prop({ required: true, limit: 50 })
  public username: string;

  @prop({ required: true, limit: 100 })
  public email: string;

  @prop({ required: false, limit: 100 })
  public address: string;

  @prop({ required: false, limit: 100 })
  public city: string;

  @prop({ required: false, limit: 100 })
  public state: string;

  @prop({ required: false })
  public zipCode: string;

  @prop({ required: false })
  public isRemember: boolean;


  toEntity(user = new User()): User {
    user = this.toBaseEntity(user);
    user.email = this.email;
    user.address = this.address || '';
    user.city = this.city || '';
    user.state = this.state || '';
    user.zipCode = this.zipCode || '' ;
    user.isRemember = this.isRemember || false ;

    return user;
  }
}

export const userDataModel = getModelForClass(User);
