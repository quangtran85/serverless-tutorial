import { CustomerRegisterDto } from '@apps/account/dtos/customer/register.dto';
import { UserService } from '@apps/account/services/user.service';
import { UserRole } from '@shared/type';
import {
  Authorized,
  Body,
  CurrentUser,
  Get,
  JsonController,
  Post,
} from 'routing-controllers';
import { Service } from 'typedi';

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
