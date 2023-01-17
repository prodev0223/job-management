import { Request, Response } from "express";
import { CreateStatusInput, DeleteStatusInput, GetStatusInput, UpdateStatusInput } from "../schemas/status.schema";
import { CreateTimesheetInput, DeleteTimesheetInput, UpdateTimesheetInput } from "../schemas/timesheet.schema";
import { createStatus, deleteStatus, findAndUpdateStatus, findStatus, findStatuses } from "../services/status.service";
import { createTimesheet, deleteTimesheet, findAndUpdateTimesheet, findTimesheet, findTimesheets } from "../services/timesheet.service";
import logger from '../utils/logger';

export async function createStatusHandler(req: Request<{}, {}, CreateStatusInput["body"]>, res: Response) {
    try {
        const status = await createStatus(req.body);
        return res.send(status);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getStatusesHandler(req: Request, res: Response) {
    if (Object.keys(req.query).length !== 0) {
        const query = req.query
        const status = await findStatuses({ ...query });
        return res.send(status);
    } else {
        const status = await findStatuses({});
        return res.send(status);
    }

}

export async function getStatusHandler(req: Request<GetStatusInput["params"]>, res: Response) {
    try {
        const userId = res.locals.user._id;
        const statusId = req.params.statusId;

        const status = await findStatus({ statusId });
        return res.send(status);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function updateStatusHandler(req: Request<UpdateStatusInput["params"], UpdateStatusInput["body"]>, res: Response) {
    const userId = res.locals.user._id;

    const statusId = req.params.statusId;
    const update = req.body;

    const status = await findStatus({ statusId });

    if (!status) {
        return res.sendStatus(404);
    }

    // TODO: Check if admin
    // if (String(status.user?._id) !== userId) {
    //     return res.sendStatus(403);
    // }

    const updatedStatus = await findAndUpdateStatus({ statusId }, update, { new: true });
    return res.send(updatedStatus);
}

export async function deleteStatusHandler(req: Request<DeleteStatusInput["params"]>, res: Response) {
    const userId = res.locals.user._id;

    const statusId = req.params.statusId;

    const status = await findStatus({ statusId });

    if (!status) {
        return res.sendStatus(410);
    }

    // TODO: Check if user is admin
    // if (String(status.user?._id) !== userId) {
    //     return res.sendStatus(403)
    // }

    await deleteStatus({ statusId });

    return res.sendStatus(200);
}