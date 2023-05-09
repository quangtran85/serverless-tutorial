import { IsOptional } from 'class-validator';
import { PaginateDto } from '@shared/dtos/paginate.dto';

export class GetUsersDto extends PaginateDto {
  @IsOptional()
  keyword?: string;
}
