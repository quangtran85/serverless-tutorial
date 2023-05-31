import { Authorized, Body, JsonController, Post, } from 'routing-controllers';
import { Service } from 'typedi';
import { PromotionCreateDto } from '@apps/store/dtos/promotion/create.dto';
import { PromotionService } from '@apps/store/services/promotion.service';
import { UserRole } from '@shared/type';

@Service()
@JsonController('/promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post('')
  @Authorized(UserRole.MANAGER)
  async create(@Body() data: PromotionCreateDto) {
    return this.promotionService.createGet(data);
  }
}
