import { Omit } from 'lodash';
import { object, number, string, TypeOf } from 'zod';


const createPayload = {
    body: object({
        status: string({
            required_error: 'Status is required',
        }),
        type: string({
            required_error: 'Type is required'
        })
    })
}

const updatePayload = {
    body: object({
        status: string({
            required_error: 'Status is required',
        }),
        type: string({
            required_error: 'Type is required'
        })
    })
}

const params = {
    params: object({
        statusId: string({
            required_error: 'Status Id is required'
        })
    })
}


export const createStatusSchema = object({
    ...createPayload
})

export const updateStatusSchema = object({
    ...updatePayload,
    ...params
})

export const deleteStatusSchema = object({
    ...params,
})

export const getStatusSchema = object({
    ...params,
})

export type CreateStatusInput = Omit<TypeOf<typeof createStatusSchema>, "createdAt" | "updatedAt">;
export type UpdateStatusInput = Omit<TypeOf<typeof updateStatusSchema>, "createdAt" | "updatedAt">;
export type DeleteStatusInput = TypeOf<typeof deleteStatusSchema>;
export type GetStatusInput = TypeOf<typeof getStatusSchema>;