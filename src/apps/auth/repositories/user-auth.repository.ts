import { Service } from 'typedi';
import { UserAuth, userAuthDataModel } from '@apps/auth/models/user-auth';
import { BaseRepository } from '@shared/data/mongodb/base.repository';

@Service()
export class UserAuthRepository extends BaseRepository<UserAuth> {
  constructor() {
    super(userAuthDataModel);
  }
}
