import {
  Authorized,
  Body,
  CurrentUser,
  JsonController,
  Post,
} from 'routing-controllers';
import { Service } from 'typedi';
import { OrderCreateDto } from '@apps/store/dtos/order/create.dto';
import { OrderService } from '@apps/store/services/order.service';
import { UserRole } from '@shared/type';

@Service()
@JsonController('/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('')
  @Authorized(UserRole.CUSTOMER)
  async create(@CurrentUser() user, @Body() data: OrderCreateDto) {
    return this.orderService.createOrder(user.userId, data);
  }
}
