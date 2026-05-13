import { JwtPayload } from 'jsonwebtoken';
import { Role } from '../generated/prisma';

// TOKEN & JWT TYPES
export interface TokenPayload extends JwtPayload {
  userId: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}



// AUTH REQUEST/RESPONSE TYPES
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResult {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: LoginResult | { accessToken: string };
}

// EXPRESS TYPES
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      userId?: string;
    }
  }
}

export {};