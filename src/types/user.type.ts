// user login type
export type TLogin = {
  email: string,
  password: string
};

// employee registration type
export type TEmployeeRegistration = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  profileImage?: string,
  role: string,
  employeeId: string,
  mobile: string,
  userName: string,
  dob: Date,
  maritalStatus: string,
  gender: string,
  employeeType: string,
  department: string,
  designation: string,
  joiningDate: Date,
  officeLocation: string,
  nationality: string,
  street: string,
  city: string,
  state: string,
  zip: string,
  createdAt?: Date,
  updatedAt?: Date
};

// client registration type
export type TClientRegistration = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  profileImage?: string,
  role: string,
  mobile: string,
  street: string,
  city: string,
  state: string,
  zip: string,
  createdAt?: Date,
  updatedAt?: Date,
};

// reset user password type
export type TResetPassword = {
  newPassword: string,
  oldPassword: string
};

// set new password type
export type TSetNewPassword = {
  newPassword: string,
  token: string
};
