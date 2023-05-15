import {
  AuthResponse,
  PolicyDocument,
  APIGatewayRequestAuthorizerEvent,
} from 'aws-lambda';
import { connectDb } from '@shared/providers/mongodb';
import { TokenRepository } from '../repositories/token.repository';
import { verifyJwtToken } from '@shared/libs/jwt-utils';
import { AppException } from '@shared/libs/exception';
import * as moment from 'moment-timezone';

// Generate policy to allow this user on this API:
const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string,
  data: any,
) => {
  const statementOne: any = {};
  statementOne.Action = 'execute-api:Invoke';
  statementOne.Effect = effect;
  statementOne.Resource = resource;

  const policyDocument: PolicyDocument = {
    Version: '2012-10-17',
    Statement: [statementOne],
  };

  const authResponse: AuthResponse = {
    principalId: principalId,
    policyDocument: policyDocument,
    context: {
      userId: data?.userId,
      role: data?.role,
    },
  };

  return authResponse;
};

export async function handler(
  event: APIGatewayRequestAuthorizerEvent,
): Promise<AuthResponse> {
  const principalId = 'principalId';
  const authToken =
    getHeaders(event.headers)?.authorization?.split(' ')[1] ?? undefined;

  try {
    if (!authToken) {
      throw new Error('Unauthorized');
    }

    const verified: any = verifyJwtToken(authToken);
    if (!verified?.userId) {
      throw new Error('Unauthorized');
    }

    const authData = await loginCheck(verified.userId, authToken);
    return generatePolicy(
      principalId,
      'Allow',
      event?.methodArn ?? (event as any).routeArn,
      authData,
    );
  } catch (error) {
    console.log(error);
    throw new Error('Unauthorized');
  }
}

const loginCheck = async (userId: string, token: string) => {
  await connectDb((process.env.MONGODB_URL as string) || '');

  const tokenData = await new TokenRepository().findOne({
    accessToken: token,
    userId: userId,
    expired: {
      $lte: moment().toDate(),
    },
  });

  if (!tokenData) {
    throw new AppException('Unauthorized', 'Unauthorized', 403);
  }

  return {
    userId: tokenData.userId,
    role: tokenData.role,
  };
};

const getHeaders = (headers: any): any => {
  const head = {};
  for (const key in headers) {
    if (headers.hasOwnProperty(key)) {
      head[key.toLowerCase()] = headers[key];
    }
  }
  return head;
};
