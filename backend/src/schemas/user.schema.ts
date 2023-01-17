import { object, string, number, TypeOf } from 'zod';


/**
 * @openapi
 * components:
 *  schemas: 
 *      CreateUserInput:
 *          type: object
 *          required: 
 *            - email
 *            - firstName
 *            - lastName
 *            - password
 *            - passwordConfirmation
 *          properties: 
 *            email:
 *              type: string
 *              default: test@example.com
 *            firstName:
 *              type: string
 *              default: Jane
 *            lastName:
 *              type: string
 *              default: Doe
 *            pinCode: 
 *              type: number
 *              default: 123456
 *            roleId:
 *              type: string
 *              default: 13r32234bce34
 *            password:
 *              type: string
 *              default: Password123!
 *            passwordConfirmation:
 *              type: string
 *              default: Password123!
 *      CreateUserResponse:
 *          type: object
 *          properties: 
 *            email:
 *              type: string
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            pinCode: 
 *              type: number
 *            roleId:
 *              type: string
 *            _id: 
 *              type: string
 *            createdAt:
 *              type: string
 *            updatedAt:
 *              type: string
 *      GetUserResponse:
 *          type: object
 *          properties: 
 *            email:
 *              type: string
 *            firstName:
 *              type: string
 *            lastName:
 *              type: string
 *            pinCode: 
 *              type: number
 *            roleId:
 *              type: string
 *            _id: 
 *              type: string
 *            createdAt:
 *              type: string
 *            updatedAt:
 *              type: string
 */
const createPayload = {
    body: object({
        firstName: string({
            required_error: 'First Name is required'
        }),
        lastName: string({
            required_error: 'Last Name is required'
        }),
        employeeId: number({
            required_error: 'Employee ID is required'
        }),
        pinCode: number({
            required_error: 'Pin Code is required',
            invalid_type_error: 'Pin Code must be a set of numbers'
        }).min(6, 'Pin Code too short - should be minimum of 6 numbers!'),
        password: string({
            required_error: 'Password is required'
        }).min(12, 'Password too short - should be 12 characters minimum!'),
        passwordConfirmation: string({
            required_error: 'Password Confirmation is required',
        }),
        email: string({
            required_error: 'Email is required'
        }).email('Not a valid email!'),
        roleId: string({
            required_error: 'RoleId is required',
        }),
        xero: object({
            employeeId: string({
                required_error: 'Xero Employee ID is required'
            }),
            earningsRateId: string({
                required_error: 'Xero Earnings Rate ID Required'
            })
        }),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'Passwords do not match',
        path: ['passwordConfirmation']
    })
}

const updatePayload = {
    body: object({
        firstName: string({
            required_error: 'First Name is required'
        }),
        lastName: string({
            required_error: 'Last Name is required'
        }),
        employeeId: number({
            required_error: 'Employee ID is required'
        }),
        email: string({
            required_error: 'Email is required'
        }).email('Not a valid email!'),
    })
}

const params = {
    params: object({
        userId: string({
            required_error: 'User ID is required!'
        })
    })
}

export const createUserSchema = object({
    ...createPayload
})

export const updateUserSchema = object({
    // ...updatePayload,
    ...params
})

export const getUserSchema = object({
    ...params,
})

export const deleteUserSchema = object({
    ...params,
})

export type CreateUserInput = Omit<TypeOf<typeof createUserSchema>, "comparePassword">;
export type UpdateUserInput = Omit<TypeOf<typeof updateUserSchema>, "comparePassword">;
export type DeleteUserInput = Omit<TypeOf<typeof deleteUserSchema>, "comparePassword">;
export type GetUserInput = Omit<TypeOf<typeof getUserSchema>, "comparePassword">;