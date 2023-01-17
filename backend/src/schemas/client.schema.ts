import { boolean, object, string, TypeOf } from 'zod';


const createPayload = {
    body: object({
        name: string({
            required_error: 'Name is required'
        }),
        isActive: boolean({
            required_error: 'Is Active is Required'
        }),
        teamsId: string({
            required_error: 'Country is required',
        }),
    })
}

const updatePayload = {
    body: object({
        name: string({
            required_error: 'Name is required'
        }),
        isActive: boolean({
            required_error: 'Is Active is Required'
        }),
        teamsId: string({
            required_error: 'Country is required',
        }),
    })
}

const params = {
    params: object({
        clientId: string({
            required_error: 'Client ID is required!'
        })
    })
}

export const createClientSchema = object({
    ...createPayload
})

export const updateClientSchema = object({
    ...updatePayload,
    ...params
})

export const getClientSchema = object({
    ...params,
})

export const deleteClientSchema = object({
    ...params,
})

export type CreateClientInput = TypeOf<typeof createClientSchema>;
export type UpdateClientInput = TypeOf<typeof updateClientSchema>;
export type DeleteClientInput = TypeOf<typeof deleteClientSchema>;
export type GetClientInput = TypeOf<typeof getClientSchema>;