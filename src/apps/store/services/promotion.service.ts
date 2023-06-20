import { PromotionRepository } from '@apps/store/repositories/promotion.repository';
import { ResourceOutput, ResourceDataOutput } from '@shared/type';
import { Service } from 'typedi';
import { Errors } from '@apps/store/configs/errors';
import { AppException } from '@shared/libs/exception';

export type PromotionOutput = ResourceOutput & {
  couponCode: string;
  percentDiscount: number;
  expirationDate: Date;
};
export type CreatePromotionInput = {
  percentDiscount: number;
  expirationDate: Date;
};

export type CheckPromotionOutput = {
  percentDiscount: number;
};

@Service()
export class PromotionService {
  constructor(private readonly promotionRepository: PromotionRepository) {}
  async createGet(
    data: CreatePromotionInput,
  ): Promise<ResourceDataOutput<PromotionOutput>> {
    const couponCode = this.generateRandomString(13);
    const isExisted = await this.promotionRepository.findOne({
      couponCode: couponCode,
    });
    if (isExisted) {
      const { errorCode, message, httpCode } = Errors.COUPON_CODE_IS_EXISTED;
      throw new AppException(errorCode, message, httpCode);
    }
    const entity = await this.promotionRepository.createGet({
      ...data,
      couponCode,
    });
    return {
      data: {
        id: entity.id,
        couponCode: entity.couponCode,
        percentDiscount: entity.percentDiscount,
        expirationDate: entity.expirationDate,
        createdAt: entity?.createdAt,
        updatedAt: entity.updatedAt,
      },
    };
  }
  generateRandomString(length: number): string {
    const chars =
      'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890';
    const randomArray = Array.from(
      { length: length },
      (v, k) => chars[Math.floor(Math.random() * chars.length)],
    );

    const randomString = randomArray.join('');
    return randomString;
  }

  async checkCouponCode(
    couponCode: string,
  ): Promise<
    ResourceDataOutput<CheckPromotionOutput> | ResourceDataOutput<boolean>
  > {
    const currentDate = new Date();

    const promotion = await this.promotionRepository.findOne({
      couponCode: couponCode,
      expirationDate: { $gte: currentDate }, // Check if the expiration date is greater than or equal to the current date
    });

    if (!promotion) {
      return { data: false };
    }

    return {
      data: {
        percentDiscount: promotion.percentDiscount,
      },
    };
  }
}
