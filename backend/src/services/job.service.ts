import dayjs from 'dayjs';
import { omit } from 'lodash';
import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import JobModel, { JobDocument } from '../models/job.model';
import JobTaskModel, { JobTaskDocument } from '../models/jobtask.model';

export async function getNextJobNumber() {
    const latestJob = await JobModel.findOne().sort({ createdAt: -1 });

    //console.log('latestJob', latestJob);

    let year = dayjs().year();

    year = year - 2000;

    if (!latestJob) {
        return Number(`${year}0001`)
    }

    return latestJob.jobNo + 1;
}

export async function createJob(input: DocumentDefinition<Omit<JobDocument, "createdAt" | "updatedAt">>) {
    try {
        const job = await JobModel.create(input)
        return job.toJSON();
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function findAndUpdateJob(query: FilterQuery<JobDocument>, update: UpdateQuery<JobDocument>, options: QueryOptions) {
    try {
        const job = await JobModel.findOne(query).lean();
        if (!job) {
            return false;
        }

        // TODO: Check if user requesting update has admin level privileges

        const updatedJob = await JobModel.findOneAndUpdate(query, update, options);
        if (!updatedJob) {
            return false
        } else {
            return updatedJob.toJSON();
        }
    } catch (e: any) {
        throw new Error(e);
    }

}

export async function findJob(query: FilterQuery<JobDocument>) {
    const job = await JobModel.findOne(query).populate('client').populate('jobStatus').populate('quoteStatus');

    if (!job) {
        return false;
    }

    return job.toJSON();
}

export async function findJobs(query: FilterQuery<JobDocument>) {
    return JobModel.find(query).lean().populate('client').populate('jobStatus').populate('quoteStatus');
}

export async function deleteJob(query: FilterQuery<JobDocument>) {
    return JobModel.deleteOne(query);
}