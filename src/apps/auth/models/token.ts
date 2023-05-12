import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { BaseModel } from '@shared/data/mongodb/base.model';
import { UserRole } from '@shared/type';

@modelOptions({ schemaOptions: { collection: 'tokens' } })
export class Token extends BaseModel<Token> {
  @prop({ required: true })
  public userId: string;

  @prop({ required: true })
  public accessToken: string;

  @prop({ required: true })
  public role: UserRole;

  @prop({ required: true })
  public refreshToken: string;

  @prop({ required: true })
  public expired: Date;

  toEntity(token = new Token()): Token {
    token = this.toBaseEntity(token);
    token.userId = this.userId;
    token.role = this.role;
    token.accessToken = this.accessToken;
    token.refreshToken = this.refreshToken;
    token.expired = this.expired;
    return token;
  }
}

export const tokenDataModel = getModelForClass(Token);
