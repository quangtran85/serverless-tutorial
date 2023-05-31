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
};
