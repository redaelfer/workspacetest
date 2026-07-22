import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest, AuthenticatedUser, CreateUserRequestBody } from '../types/users';
import { HttpError } from '../types/users';
import { createUser, getUserById, parseUserId } from '../services/usersService';

function currentUser(req: AuthenticatedRequest): AuthenticatedUser | undefined {
  return req.user ?? req.auth?.user ?? req.session?.user;
}

function canReadUser(caller: AuthenticatedUser, requestedUserId: number): boolean {
  return (
    caller.id === requestedUserId ||
    caller.isAdmin === true ||
    caller.permissions?.includes('users:read') === true
  );
}

export async function getUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
  const userId = parseUserId(req.params.id);
  const caller = currentUser(req);

  if (!caller) {
    throw new HttpError(401, 'Authentication required');
  }

  if (!canReadUser(caller, userId)) {
    throw new HttpError(403, 'Forbidden');
  }

  const user = await getUserById(userId);
  return res.json({ user });
}

export async function registerUser(
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> {
  const user = await createUser(req.body as Partial<CreateUserRequestBody>);
  return res.status(201).json({ user });
}

export function handleUserApiError(
  error: unknown,
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response | void {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  return next(error);
}
