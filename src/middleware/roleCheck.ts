import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

export const requireAdminOrSelf = (req: AuthRequest, res: Response, next: NextFunction) => {
  const requestedUserId = parseInt(req.params.id);
  
  if (req.user?.role !== 'admin' && req.user?.id !== requestedUserId) {
    return res.status(403).json({ message: 'Access denied. Admin role or ownership required.' });
  }
  
  next();
};