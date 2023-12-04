import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidaion } from './student.validation';
const router = express.Router();

router.get('/', StudentController.getAllStudents);
router.get('/:id', StudentController.getSingleStudent);
router.delete('/:id', StudentController.deleteStudent);
router.patch(
  '/:id',
  validateRequest(StudentValidaion.updateStudentZodSchema),
  StudentController.updateStudent
);

export const StudentRoutes = router;
