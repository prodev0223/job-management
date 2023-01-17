import { Role } from "./roles";

export type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  activeTask: string | undefined;
  xero: {
    employeeId: string;
    earningsRateId: string;
    currentTimesheetId: string;
    previousTimesheetId: string;
  };
  azureUser: boolean;
  pinCode: string;
  roleId: Role;
  createdAt: string;
  updatedAt: string;
};

export type XeroUser = {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  startDate?: string;
  middleNames?: string;
  email?: string;
  gender?: string;
  phone?: string;
  mobile?: string;
  ordinaryEarningsRateID?: string;
  payrollCalendarID?: string;
  employeeID?: string;
  status?: string;
  updatedDateUTC?: string;
}

export type UsersState = {
  users: { [_id: string]: User }
}