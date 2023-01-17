import { string } from 'yup';
import { CreateJob, Job, JobUpdate, Status } from '../../types/jobs';
import { apiSlice } from './apiSlice';

export const jobsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getJobs: builder.query<Job[], void>({
            query: () => '/jobs',
            keepUnusedDataFor: 60
        }),
        getJobById: builder.query<Job, string>({
            query: (jobId) => `/jobs/${jobId}`,
            keepUnusedDataFor: 2,
        }),
        getJobsByClientId: builder.query<Job[], string>({
            query: (clientId) => `/jobs?client=${clientId}`,
            keepUnusedDataFor: 60,
        }),
        getJobStatsInXeroById: builder.query({
            query: (projectId: string) => `/xero/projects/${projectId}/stats`,
            keepUnusedDataFor: 5,
        }),
        getStatuses: builder.query<Status[], void>({
            query: () => '/status',
            keepUnusedDataFor: 60,
        }),
        updateJobById: builder.mutation({
            query: ({
                jobId,
                update
            }: { jobId: string, update: JobUpdate }) => ({
                url: `/jobs/${jobId}`,
                method: 'PUT',
                body: { ...update }
            })
        }),
        createJob: builder.mutation({
            query: (job: CreateJob) => ({
                url: `/jobs`,
                method: 'POST',
                body: { ...job }
            })
        })
    })
})

export const { useGetJobsQuery, useGetJobsByClientIdQuery, useGetJobByIdQuery, useGetStatusesQuery, useGetJobStatsInXeroByIdQuery, useUpdateJobByIdMutation, useCreateJobMutation } = jobsApiSlice;