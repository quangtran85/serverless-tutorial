import { BaseModel } from '@shared/data/mongodb/base.model';
import { TokenStatus, UserRole } from '@shared/type';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

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

  @prop({
    required: true,
    default: TokenStatus.ACTIVE,
  })
  public status: TokenStatus;

  toEntity(token = new Token()): Token {
    token = this.toBaseEntity(token);
    token.userId = this.userId;
    token.role = this.role;
    token.accessToken = this.accessToken;
    token.refreshToken = this.refreshToken;
    token.expired = this.expired;
    token.status = this.status;
    return token;
  }
}

export const tokenDataModel = getModelForClass(Token);
