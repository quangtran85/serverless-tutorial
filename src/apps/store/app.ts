import 'reflect-metadata';
import * as serverless from 'serverless-http';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { BookController } from './controllers/book.controller';
import { connectDb } from '@shared/providers/mongodb';
import { HttpErrorHandler } from '@shared/middlewares/http-error-handler.middleware';
import authorizationChecker from '@shared/auth/authorization-checker';
import currentUserChecker from '@shared/auth/current-user-checker';

useContainer(Container);
export const application = createExpressServer({
  routePrefix: '/store',
  defaultErrorHandler: false,
  controllers: [BookController],
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
