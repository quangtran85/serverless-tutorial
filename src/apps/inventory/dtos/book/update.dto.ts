import {
  IsBoolean,
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
}
