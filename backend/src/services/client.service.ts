import { omit } from 'lodash';
import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import ClientModel, { ClientDocument } from '../models/client.model';


export async function createClient(input: DocumentDefinition<Omit<ClientDocument, "createdAt" | "updatedAt">>) {
    try {
        const client = await ClientModel.create(input);
        return client.toJSON();
    } catch (e: any) {
        throw new Error(e);
    }
}

export async function findAndUpdateClient(query: FilterQuery<ClientDocument>, update: UpdateQuery<ClientDocument>, options: QueryOptions) {
    try {
        const client = await ClientModel.findOne(query).lean();
        if (!client) {
            return false;
        }

        const updatedClient = await ClientModel.findOneAndUpdate(query, update, options);

        if (!updatedClient) {
            return false
        }

        return updatedClient.toJSON();
    } catch (e: any) {
        throw new Error(e);
    }
}

export async function findClient(query: string) {
    const client = await ClientModel.findById(query);
    if (!client) {
        return false
    }

    return client.toJSON();
}

export async function findClients(query: FilterQuery<ClientDocument>) {
    return ClientModel.find(query).lean();
}

export async function deleteClient(query: string) {
    return await ClientModel.findByIdAndDelete(query);
}