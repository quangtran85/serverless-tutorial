import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class BookUpdateDto {
  @IsNotEmpty()
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @MaxLength(50)
  author: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  stock: number;

  @IsOptional()
  reOrderThreshold?: number;

  @IsOptional()
  isStopOrder?: boolean;
}
