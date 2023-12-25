import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import ApiError from '../errors/ApiError';
import httpStatus from 'http-status';

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime,
  });
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }
};

export const jwtHelpers = {
  createToken,
  verifyToken,
};
