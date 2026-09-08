import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { dbService, DBUser } from '../config/db';

export interface AuthRequest extends Request {
  user?: Omit<DBUser, 'password'>;
}

const JWT_SECRET = process.env.JWT_SECRET || 'campuscare_dev_jwt_secret_key_2026';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string; email: string };
    const user = await dbService.users.findById(decoded.id);

    if (!user) {
      res.status(401).json({ success: false, message: 'User belonging to this token no longer exists.' });
      return;
    }

    const { password, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
};

export const requireRole = (role: 'student' | 'admin') => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (req.user.role !== role) {
      res.status(403).json({
        success: false,
        message: `Access denied. Requires ${role} role privileges.`,
      });
      return;
    }

    next();
  };
};
