import { object, string, number, TypeOf, date, boolean } from 'zod';


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
 *            - startDay
 *            - startHour
 *            - startMin
 *            - endDay
 *            - endHour
 *            - endMin
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
 *            startDay:
 *              type: string
 *              default: 12-07-22
 *            startHour:
 *              type: number
 *              default: 8
 *            startMin:
 *              type: number
 *              default: 35
 *            endDay:
 *              type: string
 *              default: 12-07-22
 *            endHour:
 *              type: number
 *              default: 14
 *            endMin:
 *              type: number
 *              default: 15
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
 *            startDay: 
 *              type: string
 *            startHour:
 *              type: number
 *            startMin:
 *              type: number
 *            endDay:
 *              type: string
 *            endHour:
 *              type: number
 *            endMin:
 *              type: number
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
 *            startDay: 
 *              type: string
 *            startHour:
 *              type: number
 *            startMin:
 *              type: number
 *            endDay:
 *              type: string
 *            endHour:
 *              type: number
 *            endMin:
 *              type: number
 *            createdAt:
 *              type: string
 *            updatedAt:
 *              type: string
 */
const createSeedPayload = {
    body: object({
        jobNo: number({
            required_error: 'Job Number is required',
            invalid_type_error: 'Job Number has to be of type number'
        }),
        dateSubmitted: date({
            required_error: 'Date Submitted is required',
            invalid_type_error: 'Date Submitted must of type date'
        }),
        client: string({
            required_error: 'Client is required'
        }),
        contact: object({
            name: string({
                required_error: 'Contact name is required',
            }),
            phone: string({
                required_error: 'Contact Phone is required',
            }),
            email: string({
                required_error: 'Contact Email is required',
            }).email('Not a valid email')
        }),
        address: object({
            streetAddress1: string({
                required_error: 'Street Address is required',
            }),
            city: string({
                required_error: 'City is required',
            }),
            postcode: string({
                required_error: 'postcode is required',
            }),
            state: string({
                required_error: 'state is required',
            }),
            country: string({
                required_error: 'country is required',
            }),
        }),
        description: string({
            required_error: 'Description is required'
        }),
        doAndCharge: boolean({
            required_error: 'Do And Charge is required',
            invalid_type_error: 'Do And Charge must be of type boolean'
        }),
        jobStatus: string({
            required_error: 'Job Status is required',
        }),
        quoteStatus: string({
            required_error: 'Quote Status is required',
        }),
        reqDateOfQuote: date({
            required_error: 'Required Date of Quote is required',
            invalid_type_error: 'Required Date of Quote must be of type date'
        }),
        followUpDate: date({
            required_error: 'Follow Up Date is required',
            invalid_type_error: 'Follow Up Date must be of type date'
        }),
        contractorNotes: string({
            required_error: 'Contractor notes required',
        }),
        notes: string({
            required_error: 'Notes required',
        }),
        estimator: string({
            required_error: 'Estimator is required',
        }),
        fileReference: string({
            required_error: 'File Reference is required',
        }),
        xeroReference: string({
            required_error: 'Xero Reference is required'
        })
    })
}
const createPayload = {
    body: object({
        // jobNo: number({
        //     required_error: 'Job Number is required',
        //     invalid_type_error: 'Job Number has to be of type number'
        // }),
        dateSubmitted: string({
            required_error: 'Date Submitted is required',
            invalid_type_error: 'Date Submitted must of type date'
        }),
        client: string({
            required_error: 'Client is required'
        }),
        contact: object({
            name: string({
                required_error: 'Contact name is required',
            }),
            phone: string({
                required_error: 'Contact Phone is required',
            }),
            email: string({
                required_error: 'Contact Email is required',
            }).email('Not a valid email')
        }),
        address: object({
            streetAddress1: string({
                required_error: 'Street Address is required',
            }),
            city: string({
                required_error: 'City is required',
            }),
            postcode: string({
                required_error: 'postcode is required',
            }),
            state: string({
                required_error: 'state is required',
            }),
            country: string({
                required_error: 'country is required',
            }),
        }),
        description: string({
            required_error: 'Description is required'
        }),
        doAndCharge: boolean({
            required_error: 'Do And Charge is required',
            invalid_type_error: 'Do And Charge must be of type boolean'
        }),
        jobStatus: string({
            required_error: 'Job Status is required',
        }),
        quoteStatus: string({
            required_error: 'Quote Status is required',
        }),
        reqDateOfQuote: string({
            required_error: 'Required Date of Quote is required',
            invalid_type_error: 'Required Date of Quote must be of type date'
        }),
        followUpDate: string({
            required_error: 'Follow Up Date is required',
            invalid_type_error: 'Follow Up Date must be of type date'
        }),
        estimator: string({
            required_error: 'Estimator is required',
        }),
        fileReference: string({
            required_error: 'File Reference is required',
        }),
        xeroReference: string({
            required_error: 'Xero Reference is required'
        })
    })
}

const updatePayload = {
    body: object({
        jobNo: number({
            required_error: 'Job Number is required',
            invalid_type_error: 'Job Number has to be of type number'
        }),
        dateSubmitted: string({
            required_error: 'Date Submitted is required',
            invalid_type_error: 'Date Submitted must of type date'
        }),
        client: string({
            required_error: 'Client is required'
        }),
        contact: object({
            name: string({
                required_error: 'Contact name is required',
            }),
            phone: string({
                required_error: 'Contact Phone is required',
            }),
            email: string({
                required_error: 'Contact Email is required',
            }).email('Not a valid email')
        }),
        address: object({
            streetAddress1: string({
                required_error: 'Street Address is required',
            }),
            city: string({
                required_error: 'City is required',
            }),
            postcode: string({
                required_error: 'postcode is required',
            }),
            state: string({
                required_error: 'state is required',
            }),
            country: string({
                required_error: 'country is required',
            }),
        }),
        description: string({
            required_error: 'Description is required'
        }),
        doAndCharge: boolean({
            required_error: 'Do And Charge is required',
            invalid_type_error: 'Do And Charge must be of type boolean'
        }),
        jobStatus: string({
            required_error: 'Job Status is required',
        }),
        quoteStatus: string({
            required_error: 'Quote Status is required',
        }),
        reqDateOfQuote: string({
            required_error: 'Required Date of Quote is required',
            invalid_type_error: 'Required Date of Quote must be of type date'
        }),
        followUpDate: string({
            required_error: 'Follow Up Date is required',
            invalid_type_error: 'Follow Up Date must be of type date'
        }),
        estimator: string({
            required_error: 'Estimator is required',
        }),
        fileReference: string({
            required_error: 'File Reference is required',
        }),
        xeroReference: string({
            required_error: 'Xero Reference is required'
        })
    })
}

const params = {
    params: object({
        jobId: string({
            required_error: 'Job ID is required!'
        })
    })
}

export const createJobSchema = object({
    ...createPayload
})

export const createJobSeedSchema = object({
    ...createSeedPayload
})

export const updateJobSchema = object({
    ...updatePayload,
    ...params
})

export const getJobSchema = object({
    ...params,
})

export const deleteJobSchema = object({
    ...params,
})

export type CreateJobInput = TypeOf<typeof createJobSchema>;
export type CreateJobSeedInput = TypeOf<typeof createJobSeedSchema>;
export type UpdateJobInput = TypeOf<typeof updateJobSchema>;
export type DeleteJobInput = TypeOf<typeof deleteJobSchema>;
export type GetJobInput = TypeOf<typeof getJobSchema>;