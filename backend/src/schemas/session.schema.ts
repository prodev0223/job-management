import { number, object, string } from 'zod';


//CreateSessionInput
//CreateSessionResponse
/**
 * @openapi
 * components:
 *  schemas: 
 *      CreateSessionInput:
 *          type: object
 *          required: 
 *            - email
 *            - password
 *          properties: 
 *            email:
 *              type: string
 *              default: test@example.com
 *            password:
 *              type: string
 *              default: Password123!
 *      CreateSessionResponse:
 *          type: object
 *          properties: 
 *            accessToken:
 *              type: string
 *            refreshToken:
 *              type: string
 *      GetSessionResponse:
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
export const createSessionSchema = object({
    body: object({
        email: string({
            required_error: 'Email is required',
        }),
        password: string({
            required_error: 'Password is required',
        })
    })
})

export const createKioskSessionSchema = object({
    body: object({
        employeeId: number({
            required_error: 'Employee ID is required',
        }),
        pinCode: number({
            required_error: 'PinCode is required'
        })
    })
})