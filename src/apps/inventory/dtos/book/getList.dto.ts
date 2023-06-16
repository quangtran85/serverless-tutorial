import { IsOptional } from 'class-validator';
import { PaginateDto } from '@shared/dtos/paginate.dto';

export class BookGetListDto extends PaginateDto {
  @IsOptional()
  title?: string;
}
