import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { string } from "yup/lib/locale";
import { CreateTaskInput, Task, TasksState } from "../../types/tasks";
import { apiSlice } from "./apiSlice";

export const initialState: TasksState = {
    tasks: {},
    jobTasks: {}
}

export const tasksSlice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        receivedTasks(state, action: PayloadAction<Task[]>) {
            const tasks = action.payload;
            tasks.forEach(task => {
                state.tasks[task._id] = task;
            })
        },
        receivedTasksForJobId(state, action: PayloadAction<Task[]>) {
            const tasks = action.payload;
            tasks.forEach(task => {
                state.jobTasks[task._id] = task;
            })
        }
    }
})

export const { receivedTasks, receivedTasksForJobId } = tasksSlice.actions;

export default tasksSlice.reducer;


export const tasksApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getTasks: builder.query<Task[], void>({
            query: () => '/tasks',
            keepUnusedDataFor: 5,
        }),
        getTasksByUser: builder.query<Task[], string>({
            query: (assignedUser: string) => `/tasks?assignedUser=${assignedUser}`,
            keepUnusedDataFor: 5,
        }),
        getTasksByJobId: builder.query({
            query: (jobId: string) => `/jobs/${jobId}/tasks/`,
            keepUnusedDataFor: 5,
        }),
        getTaskById: builder.query({
            query: (taskId: string) => `/tasks/${taskId}`,
            keepUnusedDataFor: 5,
        }),
        getTaskTimesById: builder.query({
            query: (taskId: string) => `/tasks/${taskId}/times`,
            keepUnusedDataFor: 5,
        }),
        createTask: builder.mutation({
            query: ({
                jobId,
                task
            }: {
                jobId: string,
                task: CreateTaskInput,
            }) => ({
                url: `/jobs/${jobId}/tasks`,
                method: 'POST',
                body: { ...task }
            })
        }),
        updateTaskById: builder.mutation({
            query: ({
                taskId,
                jobId,
                update
            }: {
                taskId: string,
                jobId: string,
                update: object
            }) => ({
                url: `/jobs/${jobId}/tasks/${taskId}`,
                method: 'PUT',
                body: { ...update }
            })
        }),
        createTaskTimeEntry: builder.mutation({
            query: ({
                taskId,
                user,
                startDay,
                startHour,
                startMin,
                endDay,
                endHour,
                endMin,
                completed
            }: {
                taskId: string,
                user: string,
                startDay: string,
                startHour: number,
                startMin: number,
                endDay: string | null,
                endHour: number | null,
                endMin: number | null,
                completed: boolean
            }) => ({
                url: `/tasks/${taskId}/times`,
                method: 'POST',
                body: {
                    user,
                    taskId,
                    startDay,
                    startHour,
                    startMin,
                    endDay,
                    endHour,
                    endMin,
                    completed
                }
            })
        }),
        updateTaskTimeEntry: builder.mutation({
            query: ({
                taskId,
                timeEntryId,
                user,
                endDay,
                endHour,
                endMin,
                completed
            }: {
                taskId: string,
                timeEntryId: string,
                user: string,
                endDay: string,
                endHour: number,
                endMin: number,
                completed: boolean
            }) => ({
                url: `/tasks/${taskId}/times/${timeEntryId}`,
                method: 'PUT',
                body: {
                    user,
                    taskId,
                    endDay,
                    endHour,
                    endMin,
                    completed
                }
            })
        })
    })
})

export const { useGetTasksQuery, useGetTasksByJobIdQuery, useGetTaskByIdQuery, useGetTaskTimesByIdQuery, useGetTasksByUserQuery, useCreateTaskMutation, useUpdateTaskByIdMutation, useCreateTaskTimeEntryMutation, useUpdateTaskTimeEntryMutation } = tasksApiSlice;