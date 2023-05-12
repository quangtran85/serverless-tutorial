import { Action } from 'routing-controllers';

export default async (action: Action) => {
  const authData = process.env.IS_OFFLINE
    ? action.request.context.authorizer
    : action.request.context.authorizer.lambda;

  return {
    userId: authData?.userId,
    role: authData?.role,
  };
};
