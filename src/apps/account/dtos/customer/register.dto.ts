import { IsEmail, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CustomerRegisterDto {
  @IsNotEmpty()
  @MaxLength(50)
  username: string;

  @IsNotEmpty()
  @MaxLength(50)
  password: string;

  @IsNotEmpty()
  @IsEmail({ allow_utf8_local_part: false })
  email: string;

  @IsOptional()
  address?: string;

  @IsOptional()
  city?: string;

  @IsOptional()
  state?: string;

  @IsOptional()
  zipCode?: string;

  @IsOptional()
  isMember?: boolean;
}
