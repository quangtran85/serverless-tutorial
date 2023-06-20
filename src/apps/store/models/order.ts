import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { BaseModel } from '@shared/data/mongodb/base.model';

class OrderItem {
  @prop({ required: true })
  public bookId: string;

  @prop({ required: true })
  public title: string;

  @prop({ required: true })
  public price: number;
}

@modelOptions({ schemaOptions: { collection: 'orders' } })
export class Order extends BaseModel<Order> {
  @prop({ required: true })
  public userId: string;

  @prop({ required: true, type: OrderItem })
  public items: OrderItem[];

  @prop({ required: true })
  public totalPrice: number;

  toEntity(order = new Order()): Order {
    order = this.toBaseEntity(order);
    order.userId = this.userId;
    order.items = this.items;
    order.totalPrice = this.totalPrice;
    return order;
  }
}

export const orderDataModel = getModelForClass(Order);
