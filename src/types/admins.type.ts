import { Department, Designation, EmployeeType, GenderStatus, MaritalStatus } from "@prisma/client";

export type TAdminUpdate = {
  mobile: string,
  userName: string,
  dob: string,
  maritalStatus: MaritalStatus,
  gender: GenderStatus,
  employeeType: EmployeeType,
  department: Department,
  designation: Designation,
  officeLocation: string,
  nationality: string,
  street: string,
  city: string,
  state: string,
  zip: number,
  appointmentLetter: string,
  salarySlips: string[],
  relivingLetter: string,
  experienceLetter: string,
  createdProjects: string[],
  user: {
    firstName: string,
    lastName: string,
    profileImage: string | null
  }
};
