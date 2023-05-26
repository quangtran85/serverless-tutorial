import { CreateUserAuthDto, LoginDto } from '@apps/auth/dtos/auth';
import { AuthService } from '@apps/auth/services/auth.service';
import { UserRole } from '@shared/type';
import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  JsonController,
  Post,
} from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@JsonController()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Delete('/logout')
  @Authorized([UserRole.CUSTOMER, UserRole.MANAGER])
  async logout(@CurrentUser() user) {
    return this.authService.logout(user.userId);
  }

  @Post('/sys/new-user-auth')
  @Authorized(UserRole.SYSTEM)
  async createUserAuth(@Body() data: CreateUserAuthDto) {
    return this.authService.createUserAuth(data);
  }
}
