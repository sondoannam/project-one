import { ROLE } from '@prisma/client';

export type JwtPayload = {
  sub: string;
  role: ROLE;
};

export type JwtUser = {
  userId: string;
  role: ROLE;
};

export type RefreshTokenPayload = {
  jti: string; // Token ID
  sub: string; // User ID
};

export type TokenResponse = {
  accessToken: string;
  accessTokenExpires: number;
  refreshToken: string;
};

export type ActiveSession = {
  id: string;
  device: string | null;
  ip: string | null;
  lastUsed: Date;
  expiresAt: Date;
  isCurrentSession?: boolean;
};
