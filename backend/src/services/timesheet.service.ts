import { omit, Omit } from "lodash";
import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from "mongoose";
import TimesheetModel, { TimesheetDocument } from "../models/timesheet.model";


export async function createTimesheet(input: DocumentDefinition<Omit<TimesheetDocument, "createdAt" | "updatedAt" | "endDate" | "endHour" | "endMin">>) {
    try {
        const timesheet = await TimesheetModel.create(input);
        return timesheet.toJSON();
    } catch (e: any) {
        throw new Error(e);
    }
}

export async function findTimesheets(query: FilterQuery<TimesheetDocument>) {
    //console.log('findTimesheets Query', query);
    return TimesheetModel.find(query).lean().populate('user', ['firstName', 'lastName', 'email']);
}

export async function findTimesheet(query: FilterQuery<TimesheetDocument>) {
    return TimesheetModel.findOne(query).lean().populate('user', ['firstName', 'lastName', 'email']);
}

export async function findAndUpdateTimesheet(query: FilterQuery<TimesheetDocument>, update: UpdateQuery<TimesheetDocument>, options: QueryOptions) {
    return TimesheetModel.findOneAndUpdate(query, update, options);
}

export async function deleteTimesheet(query: FilterQuery<TimesheetDocument>) {
    return TimesheetModel.deleteOne(query);
}