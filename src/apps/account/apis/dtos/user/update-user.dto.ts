import { IsIn, IsOptional, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsIn(['Male', 'Female', 'Other'])
  gender?: string;
}
