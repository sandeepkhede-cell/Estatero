import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    req.user = verifyToken(header.slice(7));
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireRole = (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) { res.status(401).json({ error: 'Unauthorized' }); return; }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Only agents, owners, and builders can post properties' });
      return;
    }
    next();
  };
