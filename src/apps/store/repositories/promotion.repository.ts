import { Service } from 'typedi';
import { Promotion, promotionDataModel } from '@apps/store/models/promotion';
import { BaseRepository } from '@shared/data/mongodb/base.repository';

@Service()
export class PromotionRepository extends BaseRepository<Promotion> {
  constructor() {
    super(promotionDataModel);
  }
}
