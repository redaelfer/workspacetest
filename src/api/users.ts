import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { getUser, handleUserApiError, registerUser } from '../controllers/usersController';

const router = express.Router();

function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<Response | void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    void handler(req, res, next).catch(next);
  };
}

router.get('/users/:id', asyncHandler(getUser));
router.post('/users', asyncHandler(registerUser));
router.use(handleUserApiError);

export default router;
