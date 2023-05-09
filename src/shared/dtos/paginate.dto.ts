import { SortType } from '../type';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginateDto {
  @IsNumber()
  @IsOptional()
  @Transform((obj) => (obj.value < 0 ? 0 : obj.value), { toClassOnly: true })
  limit = 10;

  @IsNumber()
  @IsOptional()
  @Transform((obj) => (obj.value < 0 ? 0 : obj.value), { toClassOnly: true })
  skip = 0;

  @IsOptional()
  @Reflect.metadata('design:type', { name: 'string' })
  @Transform(
    (obj) => {
      const sortVals: SortType = {};
      obj.value?.split('_')?.forEach((element: string) => {
        if (element) {
          const [field, type] = element.split('.');
          sortVals[field] = type === 'asc' ? 1 : -1;
        }
      });
      return sortVals;
    },
    { toClassOnly: true },
  )
  sort = { _id: -1 } as SortType;
}
