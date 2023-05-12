import * as jwt from 'jsonwebtoken';

export const verifyJwtToken = (authToken: string) => {
  return jwt.verify(authToken, process.env.TOKEN_SECRET as string, {
    algorithms: ['HS256'],
  });
};

export const generateJwtToken = async (
  body: Record<string, any>,
  expiresIn = '1h',
) => {
  return jwt.sign(body, process.env.TOKEN_SECRET as string, {
    algorithm: 'HS256',
    expiresIn: expiresIn,
  });
};
