import { IsNotEmpty, ArrayNotEmpty } from 'class-validator';

export type OrderItem = {
  bookId: string;
};

export class OrderCreateDto {
  @ArrayNotEmpty()
  items: OrderItem[];

  @IsNotEmpty()
  creditCardNumber: string;

  couponCode?: string;
}
