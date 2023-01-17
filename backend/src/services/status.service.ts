import { omit, Omit } from "lodash";
import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import StatusModel, { StatusDocument } from "../models/status.model";

export async function createStatus(input: DocumentDefinition<Omit<StatusDocument, "createdAt" | "updatedAt">>) {
    try {
        const status = await StatusModel.create(input);
        return status.toJSON();
    } catch (e: any) {
        throw new Error(e);
    }
}

export async function findStatuses(query: FilterQuery<StatusDocument>) {
    //console.log('findTimesheets Query', query);
    return StatusModel.find(query).lean();
}

export async function findStatus(query: FilterQuery<StatusDocument>) {
    return StatusModel.findOne(query).lean();
}

export async function findAndUpdateStatus(query: FilterQuery<StatusDocument>, update: UpdateQuery<StatusDocument>, options: QueryOptions) {
    return StatusModel.findOneAndUpdate(query, update, options);
}

export async function deleteStatus(query: FilterQuery<StatusDocument>) {
    return StatusModel.deleteOne(query);
}