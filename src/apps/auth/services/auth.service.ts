import { Errors } from '@apps/auth/configs/errors';
import { UserAuth } from '@apps/auth/models/user-auth';
import { TokenRepository } from '@apps/auth/repositories/token.repository';
import { UserAuthRepository } from '@apps/auth/repositories/user-auth.repository';
import { AppException } from '@shared/libs/exception';
import { generateJwtToken } from '@shared/libs/jwt-utils';
import { ResourceDataOutput, TokenStatus, UserRole } from '@shared/type';
import * as bcrypt from 'bcryptjs';
import * as moment from 'moment-timezone';
import { Service } from 'typedi';

export type CreateUserAuthInput = {
  userId: string;
  username: string;
  password: string;
  role: UserRole;
};

export type LoginInput = {
  username: string;
  password: string;
};

export type LoginOutput = {
  accessToken: string;
  refreshToken: string;
};

export type LoginCheckOutput = {
  userId: string;
  role: UserRole;
};

export type LogoutOutput = {
  isLoggedOut: boolean;
};

@Service()
export class AuthService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly userAuthRepository: UserAuthRepository,
  ) {}

  async createUserAuth(data: CreateUserAuthInput) {
    data.password = await bcrypt.hash(data.password, 10);
    return this.userAuthRepository.createGet(data);
  }

  /**
   * Proceed to login system
   *
   * @param {LoginInput} data
   * @returns {Promise<LoginOutput>}
   */
  async login(data: LoginInput): Promise<ResourceDataOutput<LoginOutput>> {
    const userAuth = await this.userAuthRepository.findOne({
      username: data.username,
    });

    if (
      !userAuth ||
      !(await bcrypt.compare(data.password, userAuth.password))
    ) {
      const { errorCode, message, httpCode } = Errors.INVALID_USERNAME_PASSWORD;
      throw new AppException(errorCode, message, httpCode);
    }

    return {
      data: await this._genereateToken(userAuth),
    };
  }

  /**
   * Proceed to login system
   *
   * @param {LoginInput} data
   * @returns {Promise<LoginOutput>}
   */
  async loginCheck(token: string): Promise<LoginCheckOutput> {
    const tokenData = await this.tokenRepository.findOne({
      accessToken: token,
      expired: {
        $lte: moment().toDate(),
      },
    });

    if (!tokenData) {
      const { errorCode, message, httpCode } = Errors.INVALID_USERNAME_PASSWORD;
      throw new AppException(errorCode, message, httpCode);
    }

    return {
      userId: tokenData.userId,
      role: tokenData.role,
    };
  }

  /**
   * Generating token
   *
   * @param {UserAuth} data
   * @returns {Promise<{ accessToken: string; refreshToken: string }>}
   */
  async _genereateToken(
    data: UserAuth,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      generateJwtToken({ userId: data.userId, role: data.role }, '1h'),
      generateJwtToken({ userId: data.userId }, '30d'),
    ]);

    const token = await this.tokenRepository.createGet({
      userId: data.userId,
      role: data.role,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expired: moment().add('1h').toDate(),
      status: TokenStatus.ACTIVE,
    });

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  async logout(userId: string): Promise<LogoutOutput> {
    const isUpdated = await this.tokenRepository.update(
      {
        userId: userId,
        status: TokenStatus.ACTIVE,
      },
      { status: TokenStatus.INACTIVE },
    );
    return { isLoggedOut: isUpdated };
  }
}
