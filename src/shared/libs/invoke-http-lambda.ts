import {
  LambdaClient,
  InvokeCommand,
  InvocationType,
} from '@aws-sdk/client-lambda';
const { stringify, parse } = JSON;
import * as queryString from 'querystring';
import { AppException } from './exception';
import { UserRole } from '@shared/type';

export type ServicePayload = {
  path: string;
  method: string;
  queryParams?: object;
  data?: object;
  requestId?: string;
  clientContext?: object;
};

export const invokeAsync = async (
  funcName: string,
  payload: ServicePayload,
) => {
  const client = new LambdaClient({
    apiVersion: '2015-03-31',
    region: process.env.AWS_DEFAULT_REGION,
    endpoint: process.env.IS_OFFLINE
      ? 'http://localhost:3002'
      : `https://lambda.${process.env.AWS_DEFAULT_REGION}.amazonaws.com`,
  });

  const clientContext = stringify(payload?.clientContext ?? {});
  const command = new InvokeCommand({
    ClientContext: Buffer.from(clientContext).toString('base64'),
    FunctionName: `${process.env.SERVICE_NAME_PREFIX}-${funcName}`,
    InvocationType: InvocationType.RequestResponse,
    Payload: Buffer.from(generatePayload(payload)),
  });

  const { Payload } = await client.send(command);
  const result = parse(Buffer.from(Payload as Uint8Array).toString());
  if (result.statusCode.toString().indexOf('2') !== 0) {
    const { statusCode, message, error } = result.body;
    throw new AppException(error, message, statusCode);
  }

  return result.body;
};

const generatePayload = (payload: ServicePayload): Buffer => {
  return Buffer.from(
    stringify({
      body: payload?.data ? stringify(payload?.data) : undefined,
      isBase64Encoded: false,
      pathParameters: null,
      queryStringParameters: payload?.queryParams ?? {},
      rawPath: payload.path,
      rawQueryString: queryString.stringify(
        (payload?.queryParams as any) ?? {},
      ),
      headers: {
        'content-type': 'application/json',
        'accept-encoding': 'gzip, deflate, br',
      },
      requestContext: {
        requestId: payload.requestId,
        authorizer: process.env.IS_OFFLINE
          ? { role: UserRole.SYSTEM }
          : { lambda: { role: UserRole.SYSTEM } },
        http: {
          method: payload.method,
          path: payload.path,
        },
        stage: '$default',
      },
      stageVariables: null,
      version: '2.0',
    }),
  );
};
