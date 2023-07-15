import { NextFunction, Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import { UserService } from './user.service';
import sendResponse from '../../../shared/sendResponse';
import { IUser } from './user.interface';
import catchAsync from '../../../shared/catchAsync';

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    // console.log("test user",user);
    const result = await UserService.createUser(user);
    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully!',
      data: result,
    });
    next();
  }
);

export const UserController = {
  createUser,
};
