import { object, string, number, TypeOf } from 'zod';


/**
 * @openapi
 * components:
 *  schemas: 
 *      CreateJobTaskInput:
 *          type: object
 *          required:
 *            - jobId
 *            - user
 *            - taskType
 *            - taskDescription
 *            - status
 *          properties: 
 *            jobId:
 *              type: string
 *              default: 62cbe19cea749c1e6f421d42
 *            user:
 *              type: string
 *              default: 62cbe19cea749c1e6f421d51
 *            taskType:
 *              type: string
 *              default: Fabrication
 *            taskDescription: 
 *              type: string
 *              default: Fabricate that one thing
 *            status:
 *              type: string
 *              default: New
 *      CreateJobTaskResponse:
 *          type: object
 *          properties: 
 *            _id:
 *              type: string
 *            jobId:
 *              type: string
 *            user:
 *              type: string
 *            taskType: 
 *              type: string
 *            taskDescription:
 *              type: string
 *            status:
 *              type: string
 *            createdAt:
 *              type: string
 *            updatedAt:
 *              type: string
 *      GetJobTaskResponse:
 *          type: object
 *          properties: 
 *            _id:
 *              type: string
 *            jobId:
 *              type: string
 *            user:
 *              type: string
 *            taskType: 
 *              type: string
 *            taskDescription:
 *              type: string
 *            status:
 *              type: string
 *            createdAt:
 *              type: string
 *            updatedAt:
 *              type: string
 */
const createPayload = {
    params: object({
        jobId: string({
            required_error: 'Job ID is required'
        })
    }),
    body: object({
        // jobId: string({
        //     required_error: 'Job ID is required'
        // }),
        assignedUser: string({
            required_error: 'User is required'
        }),
        taskType: string({
            required_error: 'Task Type is required'
        }),
        taskDescription: string({
            required_error: 'Task Type is required'
        }),
        taskRate: number({
            required_error: 'Task Rate is required',
        }),
        status: string({
            required_error: 'Status is required'
        }),
        estimatedHours: number({
            required_error: 'Estimated Hours is required',
            invalid_type_error: 'Must be of type number!'
        })
    })
}

const updatePayload = {
    body: object({
        // jobId: string({
        //     required_error: 'Job ID is required'
        // }),
        assignedUser: string({
            required_error: 'User is required'
        }),
        taskType: string({
            required_error: 'Task Type is required'
        }),
        taskDescription: string({
            required_error: 'Task Type is required'
        }),
        status: string({
            required_error: 'Status is required'
        }),
    })
}

const params = {
    params: object({
        jobId: string({
            required_error: 'Job ID is required!'
        }),
        taskId: string({
            required_error: 'Task ID is required!'
        })
    })
}

export const createJobTaskSchema = object({
    ...createPayload
})

export const updateJobTaskSchema = object({
    // ...updatePayload,
    ...params
})

export const getJobTasksSchema = object({
    params: object({
        jobId: string({
            required_error: 'Job ID is required!'
        }),
    })
})

export const getJobTaskSchema = object({
    ...params,
})

export const deleteJobTaskSchema = object({
    ...params,
})

export type CreateJobTaskInput = TypeOf<typeof createJobTaskSchema>;
export type UpdateJobTaskInput = TypeOf<typeof updateJobTaskSchema>;
export type DeleteJobTaskInput = TypeOf<typeof deleteJobTaskSchema>;
export type GetJobTaskInput = TypeOf<typeof getJobTaskSchema>;
export type GetJobTasksInput = TypeOf<typeof getJobTasksSchema>;