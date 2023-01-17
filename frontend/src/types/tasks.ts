import { Job } from "./jobs";
import { User } from "./user";

export type Task = {
    _id: string;
    jobId: Job;
    assignedUser: User;
    taskType: string;
    taskDescription: string;
    status: string;
    estimatedHours: number;
    timeEntries: [
        {
            _id?: string;
            user: {
                _id: string;
                email: string;
                firstName: string;
                lastName: string;
                roleId: string;
                updatedAt?: string;
                createdAt?: string;
            };
            startDay: string;
            startHour: number;
            startMin: number;
            endDay?: string;
            endHour?: number;
            endMin?: number;
            completed?: boolean;
        }
    ]
    createdAt?: string;
    updatedAt?: string;

}

export type TaskTime = {
    _id?: string;
    user: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
        roleId: string;
        updatedAt?: string;
        createdAt?: string;
    };
    startDay: string;
    startHour: number;
    startMin: number;
    endDay?: string;
    endHour?: number;
    endMin?: number;
    completed?: boolean;
}

export type CreateTaskInput = {
    jobId: string;
    assignedUser: string;
    taskType: string;
    taskDescription: string;
    taskRate: number;
    status: string;
    estimatedHours: number;
}

export type TasksState = {
    tasks: { [_id: string]: Task }
    jobTasks: { [_id: string]: Task }
}