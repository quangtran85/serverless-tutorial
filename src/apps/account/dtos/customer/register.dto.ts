import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CustomerRegisterDto {
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @MaxLength(50)
  password: string;

  @IsOptional()
  @IsEmail({ allow_utf8_local_part: false })
  email?: string;

  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsOptional()
  @MaxLength(10)
  postal?: string;

  @IsOptional()
  @IsBoolean()
  isMember: boolean;
}
