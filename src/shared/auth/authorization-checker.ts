import { UserRole } from '@shared/type';
import { Action } from 'routing-controllers';

export default async (action: Action, roles: string[]) => {
  const authData = process.env.IS_OFFLINE
    ? action.request.context.authorizer
    : action.request.context.authorizer.lambda;

  if (!authData) {
    return false;
  }

  const userRole: string =
    authData?.role?.toLocaleLowerCase() ?? UserRole.GUEST;
  if (roles.includes(userRole) || userRole === UserRole.SYSTEM) {
    return true;
  }

  return false;
};
