import { CreateTimesheet, Timesheet } from "../../types/timesheet";
import { apiSlice } from "./apiSlice";

export const timesheetApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCurrentUserTimesheets: builder.query<Timesheet[], void>({
            query: (userId) => `timesheets?user=${userId}`,
            keepUnusedDataFor: 60,
        }),
        createTimesheetEntry: builder.mutation({
            query: ({
                user,
                startDate,
                startHour,
                startMin,
            }: {
                user: string, startDate: string, startHour: number, startMin: number
            }) => ({
                url: `/timesheets`,
                method: 'POST',
                body: { user: user, startDate: startDate, startHour: startHour, startMin: startMin }
            })
        }),
        completeTimesheetEntry: builder.mutation({
            query: ({
                timesheetId,
                user,
                endDate,
                endHour,
                endMin,
                completed,
            }: {
                timesheetId: string, user: string, endDate: string, endHour: number, endMin: number, completed: boolean,
            }) => ({
                url: `/timesheets/${timesheetId}`,
                method: 'PUT',
                body: { user: user, endDate: endDate, endHour: endHour, endMin: endMin, completed: completed }
            })
        })
    })
})

export const { useCreateTimesheetEntryMutation, useCompleteTimesheetEntryMutation, useGetCurrentUserTimesheetsQuery } = timesheetApiSlice;