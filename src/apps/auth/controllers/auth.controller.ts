import {
  JsonController,
  Post,
  Body,
  Delete,
  Authorized,
} from 'routing-controllers';
import { Service } from 'typedi';
import { LoginDto, CreateUserAuthDto } from '@apps/auth/dtos/auth';
import { UserRole } from '@shared/type';
import { AuthService } from '@apps/auth/services/auth.service';
import { RefreshTokenDto } from '@apps/auth/dtos/auth/refresh.dto';

@Service()
@JsonController()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('/refresh')
  async refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refresh(data);
  }

  @Delete('/logout')
  @Authorized()
  async logout() {
    return true;
  }

  @Post('/sys/new-user-auth')
  @Authorized(UserRole.SYSTEM)
  async createUserAuth(@Body() data: CreateUserAuthDto) {
    return this.authService.createUserAuth(data);
  }
}
