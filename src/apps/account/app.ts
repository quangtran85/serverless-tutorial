import 'reflect-metadata';
import * as serverless from 'serverless-http';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { CustomerController } from './controllers/customer.controller';
import { connectMongoDb } from '@shared/providers/mongodb';
import { HttpErrorHandler } from '@shared/middlewares/http-error-handler.middleware';
import authorizationChecker from '@shared/auth/authorization-checker';
import currentUserChecker from '@shared/auth/current-user-checker';

connectMongoDb((process.env.MONGODB_URL as string) || '');
useContainer(Container);

export const application = createExpressServer({
  routePrefix: '/account',
  defaultErrorHandler: false,
  controllers: [CustomerController],
  middlewares: [HttpErrorHandler],
  authorizationChecker: authorizationChecker,
  currentUserChecker: currentUserChecker,
});

export const handler: serverless.Handler = serverless(application, {
  request: function (req: any, event: any) {
    req.event = event;
    req.context = event.requestContext;
  },
});
