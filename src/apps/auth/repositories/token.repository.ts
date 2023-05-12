import { Service } from 'typedi';
import { Token, tokenDataModel } from '@apps/auth/models/token';
import { BaseRepository } from '@shared/data/mongodb/base.repository';

@Service()
export class TokenRepository extends BaseRepository<Token> {
  constructor() {
    super(tokenDataModel);
  }
}
