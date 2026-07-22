import type { NextFunction, Response } from 'express';
import type Interfaces from '@/ts/Interfaces';
import HttpError from '@/ts/HttpError';
import usersService from '@/services/usersService';

function currentUser(
  req: Interfaces['AuthenticatedRequest']
): Interfaces['AuthenticatedUser'] | undefined {
  return req.user ?? req.auth?.user ?? req.session?.user;
}

function canReadUser(
  caller: Interfaces['AuthenticatedUser'],
  requestedUserId: number
): boolean {
  return (
    caller.id === requestedUserId ||
    caller.isAdmin === true ||
    caller.permissions?.includes('users:read') === true
  );
}

async function getUser(
  req: Interfaces['AuthenticatedRequest'],
  res: Response
): Promise<Response> {
  const userId = usersService.parseUserId(req.params.id);
  const caller = currentUser(req);

  if (!caller) {
    throw new HttpError(401, 'Authentication required');
  }

  if (!canReadUser(caller, userId)) {
    throw new HttpError(403, 'Forbidden');
  }

  const user = await usersService.getUserById(userId);
  return res.json({ user });
}

async function registerUser(
  req: Interfaces['AuthenticatedRequest'],
  res: Response
): Promise<Response> {
  const user = await usersService.createUser(
    req.body as Partial<Interfaces['CreateUserRequestBody']>
  );
  return res.status(201).json({ user });
}

function handleUserApiError(
  error: unknown,
  _req: Interfaces['AuthenticatedRequest'],
  res: Response,
  next: NextFunction
): Response | void {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({ error: error.message });
  }

  return next(error);
}

export default {
  getUser,
  handleUserApiError,
  registerUser,
};
