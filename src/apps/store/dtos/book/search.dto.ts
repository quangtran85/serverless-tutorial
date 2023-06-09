import { IsOptional } from 'class-validator';

export class BookSearchDto {
  @IsOptional()
  title?: string;
}
