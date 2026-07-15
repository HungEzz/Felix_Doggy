import { rateLimit } from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again after 10 seconds.' },
});

export const strictLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Unusual activity detected. Please try again after 10 seconds.' },
});

/** Separate limiter for OTP verify/resend — more generous than login. */
export const otpLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 15,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please wait 10 seconds.' },
});

/** Light rate limit for public webhook endpoints (e.g. PayOS).
 *  Main security is checksum verification — this prevents brute-force spam. */
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many requests.' },
});

