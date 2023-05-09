import { Errors } from '@account/configs/errors';
import { AppException } from '@shared/libs/exception';
import { UserRepository } from '@account/data/repositories/user.repository';
import {
  GetResourcesInput,
  ResourceOuput,
  ResourcesPaginateOuput,
  ResourceDataOutput,
} from '@shared/type';
import { Service } from 'typedi';

export type GetUsersInput = GetResourcesInput & { keyword?: string };
export type GetUsersOuput = ResourcesPaginateOuput<UserOutput>;
export type UserOutput = ResourceOuput & {
  firstName: string;
  lastName: string;
  email: string;
  gender?: string;
};
export type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
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
  constructor(private readonly userRepository: UserRepository) {}

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
            gender: item.gender,
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
      const { errorCode, message, httpCode } = Errors.OBJECT_NOT_FOUND;
      throw new AppException(errorCode, message, httpCode);
    }

    return {
      data: {
        id: result.id,
        email: result.email,
        lastName: result.lastName,
        firstName: result.firstName,
        gender: result?.gender,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      },
    };
  }

  async createGet(
    data: CreateUserInput,
  ): Promise<ResourceDataOutput<UserOutput>> {
    const entity = await this.userRepository.createGet(data);

    return {
      data: {
        id: entity.id,
        email: entity.email,
        lastName: entity.lastName,
        firstName: entity.firstName,
        gender: entity?.gender,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    };
  }

  async update(id: string, data: UpdateUserInput) {
    return this.userRepository.update(id, { ...data }, { new: true });
  }
}
