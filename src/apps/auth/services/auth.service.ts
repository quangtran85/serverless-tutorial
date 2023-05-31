import { Service } from 'typedi';
import { TokenRepository } from '../repositories/token.repository';
import { UserAuthRepository } from '../repositories/user-auth.repository';
import { ResourceDataOutput, UserRole } from '@shared/type';
import * as bcrypt from 'bcryptjs';
import { AppException } from '@shared/libs/exception';
import { Errors } from '../configs/errors';
import { UserAuth } from '../models/user-auth';
import * as moment from 'moment-timezone';
import { generateJwtToken, verifyJwtToken } from '@shared/libs/jwt-utils';

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

export type RefreshInput = {
  refreshToken: string;
};

export type TokenOutput = {
  accessToken: string;
  refreshToken: string;
};

export type LoginCheckOutput = {
  userId: string;
  role: UserRole;
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
  async login(data: LoginInput): Promise<ResourceDataOutput<TokenOutput>> {
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
      data: await this._generateToken(userAuth),
    };
  }

  /**
   * Refresh token
   *
   * @param {RefreshInput} data
   * @returns {Promise<TokenOutput>}
   */
  async refresh(data: RefreshInput): Promise<ResourceDataOutput<TokenOutput>> {
    const verified: any = verifyJwtToken(data.refreshToken);
    if (!verified?.userId) {
      const { errorCode, message, httpCode } = Errors.INVALID_REFRESH_TOKEN;
      throw new AppException(errorCode, message, httpCode);
    }

    const token = await this.tokenRepository.findOne({
      refreshToken: data.refreshToken,
    });

    return {
      data: await this._generateToken(
        {
        userId: token?.userId as string,
        role: token?.role as string,
      }),
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
   * @param withRefreshToken
   */
  async _generateToken({
    userId,
    role,
  }: {
    userId: string;
    role: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      generateJwtToken({ userId, role }, '1h'),
      generateJwtToken({ userId }, '7d'),
    ]);

    const token = await this.tokenRepository.createGet({
      userId: userId,
      role: role,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expired: moment().add('1h').toDate(),
    });

    return {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }
}
