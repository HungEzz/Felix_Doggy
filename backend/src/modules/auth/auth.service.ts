import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository';
import { env } from '../../config/env';

export const authService = {
  async register(input: { email?: string; password?: string; fullName?: string }) {
    const { email, password, fullName } = input;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const existing = await authRepository.findUserByEmail(email);
    if (existing) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authRepository.createUser(email, hashedPassword, fullName);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };
  },

  async login(input: { email?: string; password?: string }) {
    const { email, password } = input;
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const user = await authRepository.findUserByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '7d' });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  },
};
