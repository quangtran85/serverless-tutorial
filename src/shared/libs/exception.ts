export class AppException extends Error {
  httpCode: number;
  status: string;
  errorCode: string;

  constructor(code: string, message: string, httpCode: number) {
    super(message);
    this.name = 'ApplicationError';
    this.httpCode = httpCode;
    this.errorCode = code;
    Error.captureStackTrace(this, this.constructor);
  }
}
