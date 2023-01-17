import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import RoleModel, { RoleDocument } from "../models/role.model";
import { databaseResponseTimeHistogram } from "../utils/metrics";


export async function createRole(input: DocumentDefinition<Omit<RoleDocument, "users" | "createdAt" | "updatedAt">>) {
    const metricsLabels = {
        operation: `createRole`,
    }

    const timer = databaseResponseTimeHistogram.startTimer()
    try {
        const role = await RoleModel.create(input)
        timer({ ...metricsLabels, success: 'true' })
        return role.toJSON();
    } catch (e: any) {
        timer({ ...metricsLabels, success: 'false' })
        return false;
    }
}

export async function findRole(query: FilterQuery<RoleDocument>) {
    return RoleModel.findOne(query).lean().populate('users', ['firstName', 'lastName', 'email']);
}

export async function findRoles(query: FilterQuery<RoleDocument>) {
    return RoleModel.find(query).lean().populate('users', ['firstName', 'lastName', 'email']);
}

export async function findAndUpdateRole(query: FilterQuery<RoleDocument>, update: UpdateQuery<RoleDocument>, options: QueryOptions) {
    return RoleModel.findOneAndUpdate(query, update, options);
}

export async function deleteRole(query: FilterQuery<RoleDocument>) {
    return RoleModel.deleteOne(query);
}