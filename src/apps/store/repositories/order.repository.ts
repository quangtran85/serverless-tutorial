import { Service } from 'typedi';
import { Order, orderDataModel } from '@apps/store/models/order';
import { BaseRepository } from '@shared/data/mongodb/base.repository';

@Service()
export class OrderRepository extends BaseRepository<Order> {
  constructor() {
    super(orderDataModel);
  }
}
