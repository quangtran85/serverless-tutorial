import { invokeAsync } from '@shared/libs/invoke-http-lambda';
import { Service } from 'typedi';
import { ResourceDataOutput } from '@shared/type';
import { UserOutput } from '@apps/account/services/user.service';

@Service()
export class UserService {
  async getUserById(userId: string): Promise<ResourceDataOutput<UserOutput>> {
    const result = await invokeAsync('accountService', {
      path: '/account/customers/getUser',
      method: 'GET',
      queryParams: { id: userId },
    });
    return JSON.parse(result);
  }
}
