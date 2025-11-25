import { useCallback, useEffect, useState } from 'react';
import {
  otpRateLimiter,
  loginRateLimiter,
  preventClickjacking,
  getCsrfToken,
  validateAndSanitizeInput,
} from '@/lib/security';

/**
 * Custom Hook برای استفاده از security features
 */
export const useSecurity = () => {
  const [csrfToken, setCsrfToken] = useState<string>('');

  /**
   * دریافت CSRF Token
   */
  useEffect(() => {
    const token = getCsrfToken();
    setCsrfToken(token);
  }, []);

  /**
   * محافظت در برابر Clickjacking
   */
  useEffect(() => {
    preventClickjacking();
  }, []);

  /**
   * بررسی rate limit برای OTP
   */
  const checkOtpRateLimit = useCallback((phone: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } => {
    const allowed = otpRateLimiter.isAllowed(phone);
    const remaining = otpRateLimiter.getRemainingRequests(phone);
    const resetTime = otpRateLimiter.getResetTime(phone);

    return { allowed, remaining, resetTime };
  }, []);

  /**
   * بررسی rate limit برای Login
   */
  const checkLoginRateLimit = useCallback((identifier: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } => {
    const allowed = loginRateLimiter.isAllowed(identifier);
    const remaining = loginRateLimiter.getRemainingRequests(identifier);
    const resetTime = loginRateLimiter.getResetTime(identifier);

    return { allowed, remaining, resetTime };
  }, []);

  /**
   * اعتبارسنجی و پاکسازی input
   */
  const validateInput = useCallback(
    (input: string, type: 'phone' | 'email' | 'text' | 'number' | 'url') => {
      return validateAndSanitizeInput(input, type);
    },
    []
  );

  return {
    csrfToken,
    checkOtpRateLimit,
    checkLoginRateLimit,
    validateInput,
  };
};

export default useSecurity;

