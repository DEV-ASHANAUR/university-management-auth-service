import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validations';
import { AcademicFacultyController } from './academicFaculty.controller';

const router = express.Router();

router.post(
  '/create-faculty',
  validateRequest(AcademicFacultyValidation.createFacultyZodSchema),
  AcademicFacultyController.createFaculty
);

router.patch(
  '/:id',
  validateRequest(AcademicFacultyValidation.updateFacultyZodSchema),
  AcademicFacultyController.updateFaculty
);

router.delete('/:id', AcademicFacultyController.deleteByIdFromDB);

router.get('/:id', AcademicFacultyController.getSingleFaculty);

router.get('/', AcademicFacultyController.getAllFaculties);

export const AcademicFacultyRoutes = router;