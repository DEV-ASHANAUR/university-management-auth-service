import { Model } from 'mongoose';

export type IAcademicFaculty = {
  title: string;
  syncId: string;
};

export type AcademicFacultyModel = Model<
  IAcademicFaculty,
  Record<string, unknown>
>;

export type IAcademicFacultyFilter = {
  searchTerm?: string;
};

export type AcademicFacultyCreatedEvent = {
  id: string;
  title: string;
};

export type AcademicFacultyUpdatedEvent = {
  id: string;
  title: string;
};

export type AcademicFacultyDeletedEvent = {
  id: string;
};
