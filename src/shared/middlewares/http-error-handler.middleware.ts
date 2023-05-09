import { ValidationError } from 'class-validator';
import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'after' })
export class HttpErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err: any) => any) {
    const respError = {
      httpCode: error.httpCode,
      errorCode: error?.errorCode,
      message: error.message,
    };
    if (error && error.name === 'BadRequestError') {
      respError['errors'] = error.errors.map((err: ValidationError) => ({
        property: err?.property,
        constraints: err?.constraints,
      }));
    }

    response.status(error.httpCode).json(respError);
    next(error);
  }
}
