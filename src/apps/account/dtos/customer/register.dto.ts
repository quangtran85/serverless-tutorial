import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsBoolean,
} from 'class-validator';

export class CustomerRegisterDto {
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @MaxLength(50)
  password: string;

  @IsNotEmpty()
  @MaxLength(50)
  rePassword: string;

  @IsOptional()
  @IsEmail({ allow_utf8_local_part: false })
  email?: string;

  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(100)
  lastName: string;

  @IsNotEmpty()
  @MaxLength(100)
  address: string;

  @IsNotEmpty()
  @MaxLength(50)
  city: string;

  @IsNotEmpty()
  @MaxLength(50)
  state: string;

  @IsNotEmpty()
  @MaxLength(20)
  zipCode: string;

  @IsOptional()
  @IsBoolean()
  isMember: boolean;
}
