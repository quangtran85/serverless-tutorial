export const Errors = {
  INVALID_USERNAME_PASSWORD: {
    httpCode: 403,
    errorCode: 'Unauthorized',
    message: 'The username or password does not matched.',
  },
  INVALID_REFRESH_TOKEN: {
    httpCode: 400,
    errorCode: 'InvalidRefreshToken',
    message: 'The refresh token is invalid.',
  },
};
