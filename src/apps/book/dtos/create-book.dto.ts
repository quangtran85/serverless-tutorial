import { IsNotEmpty, IsOptional, MaxLength, IsBoolean } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsNotEmpty()
  @MaxLength(100)
  authorName: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  numberInStock: number;

  @IsOptional()
  @IsBoolean()
  stopOrder?: boolean;

  @IsOptional()
  reorderThreshold?: number;
}
