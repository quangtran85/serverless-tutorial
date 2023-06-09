import { Errors } from '@apps/account/configs/errors';
import { AppException } from '@shared/libs/exception';
import { UserRepository } from '@apps/account/repositories/user.repository';
import {
  GetResourcesInput,
  ResourceOuput,
  ResourcesPaginateOuput,
  ResourceDataOutput,
  UserRole,
} from '@shared/type';
import { Service } from 'typedi';
import { AuthService } from './auth.service';

export type GetUsersInput = GetResourcesInput & { keyword?: string };
export type GetUsersOuput = ResourcesPaginateOuput<UserOutput>;
export type UserOutput = ResourceOuput & {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
};
export type CreateUserInput = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email?: string;
  gender?: string;
};
export type UpdateUserInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string;
};

@Service()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async getAll(data: GetUsersInput): Promise<GetUsersOuput> {
    const result = await this.userRepository.findAndCount({}, { ...data });
    return {
      data: result?.data.map(
        (item) =>
          ({
            id: item.id,
            email: item.email,
            lastName: item.lastName,
            firstName: item.firstName,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          } as UserOutput),
      ),
      pagination: result.pagination,
    };
  }

  async get(id: string): Promise<ResourceDataOutput<UserOutput>> {
    const result = await this.userRepository.get(id);
    if (!result) {
      const { errorCode, message, httpCode } = Errors.RESOURCE_NOT_FOUND;
      throw new AppException(errorCode, message, httpCode);
    }

    return {
      data: {
        id: result.id,
        username: result.username,
        email: result.email,
        lastName: result.lastName,
        firstName: result.firstName,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    };
  }

  async createGet(
    data: CreateUserInput,
  ): Promise<ResourceDataOutput<UserOutput>> {
    const isExisted = await this.userRepository.findOne({
      username: data.username,
    });
    if (isExisted) {
      const { errorCode, message, httpCode } = Errors.USERNAME_IS_EXISTED;
      throw new AppException(errorCode, message, httpCode);
    }

    const entity = await this.userRepository.createGet(data);
    await this.authService.createUserAuth({
      userId: entity.id,
      role: UserRole.CUSTOMER,
      username: data.username,
      password: data?.password,
    });

    return {
      data: {
        id: entity.id,
        email: entity.email,
        username: entity.username,
        lastName: entity.lastName,
        firstName: entity.firstName,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    };
  }

  async update(id: string, data: UpdateUserInput) {
    return this.userRepository.update(id, { ...data }, { new: true });
  }
}
