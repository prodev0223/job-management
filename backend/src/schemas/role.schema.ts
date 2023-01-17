import { array, object, string, TypeOf } from 'zod';

const payload = {
    body: object({
        name: string({
            required_error: 'Name is required'
        }),
        // users: string({
        //     required_error: 'User is required!'
        // })
    })
}

const params = {
    params: object({
        roleId: string({
            required_error: 'Role ID is required',
        }),
    })
}
export const createRoleSchema = object({
    ...payload
})

export const updateRoleSchema = object({
    ...params,
    ...payload,
})

export const deleteRoleSchema = object({
    ...params,
})

export type CreateRoleInput = TypeOf<typeof createRoleSchema>;
export type UpdateRoleInput = TypeOf<typeof updateRoleSchema>;
export type DeleteRoleInput = TypeOf<typeof deleteRoleSchema>;