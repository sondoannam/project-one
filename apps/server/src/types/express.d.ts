import { JwtUser } from '../modules/auth/types';

declare global {
  namespace Express {
    // Extend the Express Request interface
    interface Request {
      user?: JwtUser;
    }
  }
}

// This is required for TypeScript to recognize this as a module
export {};
