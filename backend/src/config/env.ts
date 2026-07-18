import dotenv from 'dotenv';

dotenv.config();

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`FATAL: ${name} is not defined in environment variables.`);
  }
  return value;
};

export const env = {
  PORT: process.env.PORT || '3000',
  DATABASE_URL: getRequiredEnv('DATABASE_URL'),
  JWT_SECRET: getRequiredEnv('JWT_SECRET'),
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY || '',
  DEEPSEEK_API_URL: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/chat/completions',
  DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  HF_API_TOKEN: process.env.HF_API_TOKEN || '',
  HF_MODEL: process.env.HF_MODEL || 'google/flan-t5-base',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  RESEND_FROM: process.env.RESEND_FROM || 'onboarding@resend.dev',
  CLOUDINARY_CLOUD_NAME: getRequiredEnv('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: getRequiredEnv('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getRequiredEnv('CLOUDINARY_API_SECRET'),
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  PAYOS_CLIENT_ID: process.env.PAYOS_CLIENT_ID || '',
  PAYOS_API_KEY: process.env.PAYOS_API_KEY || '',
  PAYOS_CHECKSUM_KEY: process.env.PAYOS_CHECKSUM_KEY || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
