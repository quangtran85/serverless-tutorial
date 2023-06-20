export const Errors = {
  RESOURCE_NOT_FOUND: {
    httpCode: 404,
    errorCode: 'NotFound',
    message: 'The resource does not found.',
  },
  COUPON_CODE_IS_EXISTED: {
    httpCode: 409,
    errorCode: 'AlreadyExists',
    message: 'The coupon code is already existed.',
  },
  INVALID_CREDIT_CARD: {
    httpCode: 400,
    errorCode: 'InvalidCreditCard',
    message: 'The provided credit card number is invalid.',
  },
  INSUFFICIENT_STOCK: {
    httpCode: 400,
    errorCode: 'InsufficientStock',
    message: 'The following books (%s) in the order have insufficient stock.',
  },
  INVALID_COUPON_CODE: {
    httpCode: 400,
    errorCode: 'InvalidCouponCode',
    message: 'The provided coupon code is invalid.',
  },
};
