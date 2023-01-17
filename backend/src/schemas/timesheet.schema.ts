import { Omit } from 'lodash';
import { object, number, string, TypeOf, boolean } from 'zod';


const createPayload = {
    body: object({
        user: string({
            required_error: 'User ID is required',
        }),
        startDate: string({
            required_error: 'Start Date is required',
        }),
        startHour: number({
            required_error: 'Start Hour is required',
        }),
        startMin: number({
            required_error: 'Start Minute is required',
        })
    })
}

const updatePayload = {
    body: object({
        user: string({
            required_error: 'User ID is required',
        }),
        endDate: string({
            required_error: 'End Date is required'
        }),
        endHour: number({
            required_error: 'End Hour is required'
        }),
        endMin: number({
            required_error: 'End Minute is required'
        }),
        completed: boolean({
            required_error: 'Completed flag is required'
        })
    })
}

const params = {
    params: object({
        timesheetId: string({
            required_error: 'timesheetId is required'
        })
    })
}


export const createTimesheetSchema = object({
    ...createPayload
})

export const updateTimesheetSchema = object({
    ...updatePayload,
    ...params
})

export const deleteTimesheetSchema = object({
    ...params,
})

export const getTimesheetSchema = object({
    ...params,
})

export type CreateTimesheetInput = Omit<TypeOf<typeof createTimesheetSchema>, "endDate" | "endHour" | "endMin" | "createdAt" | "updatedAt">;
export type UpdateTimesheetInput = Omit<TypeOf<typeof updateTimesheetSchema>, "createdAt" | "updatedAt">;
export type DeleteTimesheetInput = TypeOf<typeof deleteTimesheetSchema>;
export type GetTimesheetInput = TypeOf<typeof getTimesheetSchema>;

export declare enum DaysOfWeek {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6

}