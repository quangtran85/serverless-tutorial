export const Errors = {
  RESOURCE_NOT_FOUND: {
    httpCode: 404,
    errorCode: 'NotFound',
    message: 'The resource does not found.',
  },
  USERNAME_IS_EXISTED: {
    httpCode: 409,
    errorCode: 'AlreadyExists',
    message: 'The username is already existed.',
  },
};
