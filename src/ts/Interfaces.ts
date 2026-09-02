import type { Request } from 'express';

export default interface Interfaces {
  AuthenticatedUser: {
    id: number;
    isAdmin?: boolean;
    permissions?: string[];
  };
  AuthenticatedRequest: Request & {
    user?: Interfaces['AuthenticatedUser'];
    auth?: { user?: Interfaces['AuthenticatedUser'] };
    session?: { user?: Interfaces['AuthenticatedUser'] };
  };
  CreateUserRequestBody: {
    email: string;
    password: string;
  };
  UserResponseDto: {
    id: number;
    email: string;
  };
}
