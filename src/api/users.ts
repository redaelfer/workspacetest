import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import usersController from '@/controllers/usersController';

const { getUser, handleUserApiError, registerUser } = usersController;
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
