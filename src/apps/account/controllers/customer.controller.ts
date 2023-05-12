import {
  JsonController,
  Get,
  Post,
  Body,
  Authorized,
  CurrentUser,
} from 'routing-controllers';
import { Service } from 'typedi';
import { CustomerRegisterDto } from '@apps/account/dtos/customer/register.dto';
import { UserService } from '@apps/account/services/user.service';
import { UserRole } from '@shared/type';

@Service()
@JsonController('/customers')
export class CustomerController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @Authorized(UserRole.CUSTOMER)
  async getProfile(@CurrentUser() user) {
    return this.userService.get(user.userId);
  }

  @Post('/register')
  async create(@Body() data: CustomerRegisterDto) {
    return this.userService.createGet(data);
  }
}
