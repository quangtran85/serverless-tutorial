import { PaginateDto } from '@shared/dtos/paginate.dto';
import { BookStatus } from '@shared/type';
import { IsOptional } from 'class-validator';

export class BookGetListDto extends PaginateDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  status?: BookStatus;
}
