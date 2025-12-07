import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user';

export interface AuthRequest extends Request {
  user?: User;
}


interface DecodedToken extends JwtPayload {
  userId: number;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Access token is required' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, jwtSecret) as DecodedToken;
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({ message: 'User account is deactivated' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ message: 'Invalid token' });
    } else {
      console.error('Auth error:', error);
      res.status(500).json({ message: 'Authentication failed' });
    }
  }
};