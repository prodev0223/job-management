import { Client } from "./clients"


export type Status = {
    _id: string;
    status: string;
    type: "Job" | "Quote";
    createdAt: string;
    updatedAt: string;
}


export type Job = {
    _id: string;
    jobNo: string;
    dateSubmitted: string;
    client: Client;
    contact: {
        name: string;
        email: string;
        phone: string;
    }
    address: {
        streetAddress1: string;
        streetAddress2?: string;
        city: string;
        postcode: string;
        state: string;
        country: string;
    }
    description: string;
    doAndCharge: boolean;
    jobStatus: Status;
    quoteStatus: Status;
    reqDateOfQuote: string;
    followUpDate: string;
    completedDate?: string;
    estimator: string;
    fileReference: string;
    xeroReference: string;
    createdAt: string;
    updatedAt: string;
}

export type JobUpdate = {
    _id?: string;
    jobNo?: string;
    dateSubmitted?: string;
    client?: string;
    contact?: {
        name?: string;
        email?: string;
        phone?: string;
    }
    address?: {
        streetAddress1?: string;
        streetAddress2?: string;
        city?: string;
        postcode?: string;
        state?: string;
        country?: string;
    }
    description?: string;
    doAndCharge?: boolean;
    jobStatus?: string;
    quoteStatus?: string;
    reqDateOfQuote?: string;
    followUpDate?: string;
    estimator?: string;
    fileReference?: string;
    xeroReference?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type CreateJob = {
    dateSubmitted?: string;
    client?: string;
    contact?: {
        name?: string;
        email?: string;
        phone?: string;
    }
    address?: {
        streetAddress1?: string;
        streetAddress2?: string;
        city?: string;
        postcode?: string;
        state?: string;
        country?: string;
    }
    description?: string;
    doAndCharge?: boolean;
    jobStatus?: string;
    quoteStatus?: string;
    reqDateOfQuote?: string;
    followUpDate?: string;
    estimator?: string;
    fileReference?: string;
    xeroReference?: string;
}

export type JobsState = {
    jobs: { [_id: string]: Job },
    statuses: { [_id: string]: Status }
}
