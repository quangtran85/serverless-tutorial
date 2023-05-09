import 'reflect-metadata';
import * as serverless from 'serverless-http';
import { createExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import { PostController } from '@cms/apis/controllers/post.controller';

useContainer(Container);

export const application = createExpressServer({
  routePrefix: '/cms',
  defaultErrorHandler: true,
  controllers: [PostController],
  middlewares: [],
});

export const handler: serverless.Handler = serverless(application);
