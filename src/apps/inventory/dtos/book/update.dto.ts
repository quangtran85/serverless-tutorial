import { BookStatus } from '@shared/type';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';

export class BookUpdateDto {
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsNotEmpty()
  @MaxLength(200)
  author: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stock: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  reorderThreshold: number;

  @IsOptional()
  @IsBoolean()
  stopOrder?: boolean;

  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;
}
