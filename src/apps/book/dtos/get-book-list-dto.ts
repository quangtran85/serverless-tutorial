import { IsOptional } from 'class-validator';
import { PaginateDto } from '@shared/dtos/paginate.dto';
export class GetBookListDto extends PaginateDto {
  @IsOptional()
  title?: string;
}
