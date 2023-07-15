import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../../shared/catchAsync';
import { AcademicSemesterService } from './academicSemester.service';
import sendResponse from '../../../shared/sendResponse';
import { IAcademicSemester } from './academicSemester.interface';
import httpStatus from 'http-status';

const createSemester = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...academicSemesterData } = req.body;
    const result = await AcademicSemesterService.createSemester(
      academicSemesterData
    );
    sendResponse<IAcademicSemester>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic semester create successFully!',
      data: result,
    });
    next();
  }
);

export const AcademicSemesterController = {
  createSemester,
};
