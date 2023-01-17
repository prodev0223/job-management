import { omit } from 'lodash';
import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { JobTaskModel, JobTaskTimeModel, JobTaskDocument, JobTaskTimeDocument } from '../models/jobtask.model';

export async function createJobTask(input: DocumentDefinition<Omit<JobTaskDocument, "createdAt" | "updatedAt">>) {
    try {
        const task = await JobTaskModel.create(input)
        return task.toJSON();
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function createJobTaskTime(input: DocumentDefinition<Omit<JobTaskTimeDocument, "createdAt" | "updatedAt">>) {
    try {
        const time = await JobTaskTimeModel.create(input)
        return time.toJSON();
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function findAndUpdateJobTask(query: FilterQuery<JobTaskDocument>, update: UpdateQuery<JobTaskDocument>, options: QueryOptions) {
    try {
        const task = await JobTaskModel.findOne(query).lean();
        if (!task) {
            return false;
        }

        // TODO: Check if user requesting update has admin level privileges

        const updatedTask = await JobTaskModel.findOneAndUpdate(query, update, options);
        if (!updatedTask) {
            return false
        } else {
            return updatedTask.toJSON();
        }
    } catch (e: any) {
        throw new Error(e);
    }

}

export async function findAndUpdateJobTaskTime(query: FilterQuery<JobTaskTimeDocument>, update: UpdateQuery<JobTaskTimeDocument>, options: QueryOptions) {
    try {
        const time = await JobTaskTimeModel.findOne(query).lean();
        if (!time) {
            return false;
        }

        const updatedTime = await JobTaskTimeModel.findOneAndUpdate(query, update, options);
        if (!updatedTime) {
            return false
        } else {
            return updatedTime.toJSON();
        }
    } catch (e: any) {
        throw new Error(e);
    }

}

export async function findJobTaskTime(query: FilterQuery<JobTaskTimeDocument>) {
    const time = await JobTaskTimeModel.findOne(query).populate('user', 'email firstName lastName roleId createdAt updatedAt');

    if (!time) {
        return false;
    }

    return time.toJSON();
}

export async function findJobTask(query: FilterQuery<JobTaskDocument>) {
    const task = await JobTaskModel.findOne(query).populate('assignedUser', 'email firstName lastName pinCode roleId createdAt updatedAt').populate('jobId').populate({
        path: 'timeEntries', populate: {
            path: 'user',
            select: 'email firstName lastName roleId createdAt updatedAt'
        }
    });

    if (!task) {
        return false;
    }

    return task.toJSON();
}

export async function findJobTaskById(id: string) {
    const task = await JobTaskModel.findById(id).populate('jobId').populate('assignedUser', 'email firstName lastName pinCode roleId createdAt updatedAt').populate({
        path: 'timeEntries', populate: {
            path: 'user',
            select: 'email firstName lastName roleId createdAt updatedAt'
        }
    });

    if (!task) {
        return false;
    }

    return task;
}

export async function findJobTasks(query: FilterQuery<JobTaskDocument>) {
    return JobTaskModel.find(query).lean().populate('assignedUser', 'email firstName lastName pinCode roleId createdAt updatedAt').populate({
        path: 'jobId', populate: {
            path: 'client'
        }
    }).populate({
        path: 'timeEntries', populate: {
            path: 'user',
            select: 'email firstName lastName roleId createdAt updatedAt'
        }
    });
}

export async function deleteJobTask(query: FilterQuery<JobTaskDocument>) {
    return JobTaskModel.deleteOne(query);
}