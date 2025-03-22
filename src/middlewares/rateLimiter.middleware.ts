import rateLimit from 'express-rate-limit';

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

export const authLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: MAX_REQUESTS,
  message: { error: 'Too many requests. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const registrationLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: MAX_REQUESTS,
  message: { error: 'Too many registration attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const profileUpdateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: MAX_REQUESTS,
  message: { error: 'Too many profile update attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
