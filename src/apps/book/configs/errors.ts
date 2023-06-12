export const Errors = {
  ERROR_CREATE_BOOK: {
    httpCode: 500,
    errorCode: 'E_CREATE_BOOK',
    message: 'Creating book has been error',
  },
  ERROR_BOOK_EXISTS: {
    httpCode: 409,
    errorCode: 'E_BOOK_IS_EXIST',
    message: 'The book is already exist',
  },
  ERROR_BOOK_NOT_FOUND: {
    httpCode: 404,
    errorCode: 'E_BOOK_NOT_FOUND',
    message: 'The book is not found',
  },
};
