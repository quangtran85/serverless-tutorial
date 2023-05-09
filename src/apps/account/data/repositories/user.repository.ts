import { Service } from 'typedi';
import { User, userDataModel } from '@account/data/models/user';
import { BaseRepository } from '@shared/data/mongodb/base.repository';

@Service()
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(userDataModel);
  }
}
