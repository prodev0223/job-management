export type Client = {
    _id: string;
    name: string;
    contact: string;
    email: string;
    phoneNumber: string;
    streetAddress1: string;
    streetAddress2?: string;
    city: string;
    postcode: string;
    state: string;
    country: string;
    website: string;
    isActive: boolean;
    xeroId: string;
    teamsId: string;
}

// export type JobClient = {
//     _id: string;
//     name: string;
//     contact: string;
//     phoneNumber: string;
//     streetAddress1: string;
//     streetAddress2?: string;
//     city: string;
//     postcode: string;
//     state: string;
//     country: string;
//     website: string;
//     xeroId: string;
//     teamsId: string;
// }

export type CreateClient = {
    name: string,
    teamsId: string,
    isActive: boolean
}

export type ClientsState = {
    clients: { [_id: string]: Client }
    selectedClient?: Client
}
