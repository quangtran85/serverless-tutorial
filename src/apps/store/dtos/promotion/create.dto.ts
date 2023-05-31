import { IsNotEmpty } from 'class-validator';

export class PromotionCreateDto {
  @IsNotEmpty()
  percentDiscount: number;

  @IsNotEmpty()
  expirationDate: Date;
}
