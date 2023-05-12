import { invokeAsync } from '@shared/libs/invoke-http-lambda';
import { UserRole } from '@shared/type';
import { Service } from 'typedi';

export type CreateUserAuthInput = {
  userId: string;
  username: string;
  password: string;
  role: UserRole;
};

@Service()
export class AuthService {
  async createUserAuth(data: CreateUserAuthInput): Promise<boolean> {
    const result = await invokeAsync('authService', {
      path: '/auth/sys/new-user-auth',
      method: 'POST',
      data: data,
    });
    return !!result;
  }
}
