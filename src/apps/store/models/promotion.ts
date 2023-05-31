import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { BaseModel } from '@shared/data/mongodb/base.model';

@modelOptions({ schemaOptions: { collection: 'promotions' } })
export class Promotion extends BaseModel<Promotion> {
  @prop({ required: true })
  public couponCode: string;

  @prop({ required: true })
  public percentDiscount: number;

  @prop({ required: true })
  public expirationDate: Date;

  toEntity(promotion = new Promotion()): Promotion {
    promotion = this.toBaseEntity(promotion);
    promotion.couponCode = this.couponCode;
    promotion.percentDiscount = this.percentDiscount;
    promotion.expirationDate = this.expirationDate;
    return promotion;
  }
}

export const promotionDataModel = getModelForClass(Promotion);
