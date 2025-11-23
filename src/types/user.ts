/**
 * انواع مربوط به کاربر
 */

export type UserType = "user" | "agent" | "admin";

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  type: UserType;
  company?: string;
  licenseNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  tokens: AuthTokens;
  created: boolean;
}

