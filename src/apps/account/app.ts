import authorizationChecker from '@shared/auth/authorization-checker';
import currentUserChecker from '@shared/auth/current-user-checker';
import { HttpErrorHandler } from '@shared/middlewares/http-error-handler.middleware';
import { connectDb } from '@shared/providers/mongodb';
import 'reflect-metadata';
import { createExpressServer, useContainer } from 'routing-controllers';
import * as serverless from 'serverless-http';
import { Container } from 'typedi';
import { CustomerController } from './controllers/customer.controller';

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
  request: async (req: any, event: any) => {
    await connectDb((process.env.MONGODB_URL as string) || '');
    req.event = event;
    req.context = event.requestContext;
  },
});
