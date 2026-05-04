import jwt from 'jsonwebtoken';

const SECRET      = process.env.JWT_SECRET ?? 'dev_secret_change_in_production';
const EXPIRES_IN  = process.env.JWT_EXPIRES_IN ?? '7d';

export interface JwtPayload {
  userId: number;
  email:  string;
  role:   string;
}

export const signToken   = (payload: JwtPayload) =>
  jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN } as jwt.SignOptions);

export const verifyToken = (token: string) =>
  jwt.verify(token, SECRET) as JwtPayload;
