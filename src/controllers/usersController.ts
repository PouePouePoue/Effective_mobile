import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import UserService from '../services/userService';

const userService = new UserService();

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await userService.getUserById(parseInt(req.params.id, 10));
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const blockUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await userService.blockUser(parseInt(req.params.id, 10));
    res.json({ message: 'User blocked successfully', user });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const searchUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { q } = req.query;
    
    const users = await userService.searchUsers(q as string);
    res.json(users);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};