import { Request, Response } from 'express';
import { authService } from './auth.service';
import { AuthenticatedRequest } from '../../types/auth';

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      if (
        error.message === 'Email and password are required' ||
        error.message === 'Email already exists' ||
        error.message.includes('characters')
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
      if (error.message === 'ACCOUNT_NOT_VERIFIED') {
        // Return a special response so frontend knows to show OTP screen
        res.status(403).json({
          message: 'Account not verified. Please enter the OTP code.',
          requireOtp: true,
          email: req.body.email,
        });
        return;
      }
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

  async loginWithGoogle(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const result = await authService.loginWithGoogle(token);
      res.json({
        message: 'Login successful',
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      if (
        error.message.includes('required') ||
        error.message.includes('invalid') || error.message.includes('Invalid') ||
        error.message.includes('Unable to retrieve') ||
        error.message.includes('not configured')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error('Google login error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async verifyOtp(req: Request, res: Response) {
    try {
      const result = await authService.verifyOtp(req.body);
      res.json(result);
    } catch (error: any) {
      if (
        error.message.includes('OTP') ||
        error.message.includes('required') ||
        error.message.includes('expired') ||
        error.message.includes('exist') ||
        error.message.includes('verified')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error('Verify OTP error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async resendOtp(req: Request, res: Response) {
    try {
      const result = await authService.resendOtp(req.body);
      res.json(result);
    } catch (error: any) {
      if (
        error.message.includes('required') ||
        error.message.includes('exist') ||
        error.message.includes('already verified') ||
        error.message.includes('wait') ||
        error.message.includes('Too many')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error('Resend OTP error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async updateProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const user = await authService.updateProfile(req.user.id, req.body);
      res.json({ message: 'Profile updated successfully', user });
    } catch (error: any) {
      if (
        error.message.includes('required') ||
        error.message.includes('must not') ||
        error.message.includes('invalid') || error.message.includes('Invalid')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const result = await authService.changePassword(req.user.id, req.body);
      res.json(result);
    } catch (error: any) {
      if (
        error.message.includes('Please') ||
        error.message.includes('incorrect') ||
        error.message.includes('characters') ||
        error.message.includes('exist')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error('Change password error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const result = await authService.forgotPassword(req.body);
      res.json(result);
    } catch (error: any) {
      if (
        error.message.includes('required') ||
        error.message.includes('wait') ||
        error.message.includes('Too many')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const result = await authService.resetPassword(req.body);
      res.json(result);
    } catch (error: any) {
      if (
        error.message.includes('required') ||
        error.message.includes('OTP') ||
        error.message.includes('expired') ||
        error.message.includes('exist') ||
        error.message.includes('characters') ||
        error.message.includes('incorrect')
      ) {
        res.status(400).json({ message: error.message });
        return;
      }
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};
