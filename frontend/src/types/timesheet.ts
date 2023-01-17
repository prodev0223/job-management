import { User } from "./user";

export type Timesheet = {
    _id: string;
    user: string;
    startDate: string;
    startHour: number;
    startMin: number;
    endDate: string;
    endHour: number;
    endMin: number;
};

export type CreateTimesheet = {
    user: User['_id'];
    startDate: string;
    startHour: number;
    startMin: number;
};