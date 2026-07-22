import type { Request } from 'express';

export interface AuthenticatedUser {
  id: number;
  isAdmin?: boolean;
  permissions?: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  auth?: { user?: AuthenticatedUser };
  session?: { user?: AuthenticatedUser };
}

export interface CreateUserRequestBody {
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: number;
  email: string;
}

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
