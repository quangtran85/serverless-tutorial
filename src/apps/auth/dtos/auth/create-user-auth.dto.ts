import { UserRole } from '@shared/type';
import { IsNotEmpty } from 'class-validator';

export class CreateUserAuthDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  role: UserRole;
}
