import { Request, Response } from 'express';
import { authService } from './auth.service';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error: any) {
      if (
        error.message === 'Email and password are required' ||
        error.message === 'Email already exists'
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error('Register error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      res.json({
        message: 'Login successful',
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      if (
        error.message === 'Email and password are required' ||
        error.message === 'Invalid credentials'
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};
