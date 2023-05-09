import 'reflect-metadata';
import * as serverless from 'serverless-http';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { UserController } from './apis/controllers/user.controller';
import { connectMongoDb } from '@shared/providers/mongodb';
import { HttpErrorHandler } from '@shared/middlewares/http-error-handler.middleware';
connectMongoDb((process.env.MONGODB_URL as string) || '');
useContainer(Container);

export const application = createExpressServer({
  routePrefix: '/account',
  defaultErrorHandler: false,
  controllers: [UserController],
  middlewares: [HttpErrorHandler],
});

export const handler: serverless.Handler = serverless(application);
