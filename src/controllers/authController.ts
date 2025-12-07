import { Request, Response } from 'express';
import AuthService from '../services/authService';

const authService = new AuthService();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await authService.register(req.body);

    const { password, ...userResponse } = user.toJSON();

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Unknown error occurred' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }
    
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(400).json({ message: 'Unknown error occurred' });
    }
  }
};