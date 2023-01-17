import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import { Request, Response } from "express";
import { CreateTimesheetInput, DaysOfWeek, DeleteTimesheetInput, UpdateTimesheetInput } from "../schemas/timesheet.schema";
import { createTimesheet, deleteTimesheet, findAndUpdateTimesheet, findTimesheet, findTimesheets } from "../services/timesheet.service";
import { findUser } from "../services/user.service";
import { createXeroTimesheet, findXeroTimesheet } from "../services/xero.service";
import logger from '../utils/logger';

export async function createTimesheetHandler(req: Request<{}, {}, CreateTimesheetInput["body"]>, res: Response) {
    try {
        const timesheet = await createTimesheet({ ...req.body, completed: false });
        return res.send(timesheet);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getTimesheetsHandler(req: Request, res: Response) {
    if (Object.keys(req.query).length !== 0) {
        const query = req.query
        const timesheets = await findTimesheets({ ...query });
        return res.send(timesheets);
    } else {
        const timesheets = await findTimesheets({});
        return res.send(timesheets);
    }

}

export async function updateTimesheetHandler(req: Request<UpdateTimesheetInput["params"], UpdateTimesheetInput["body"]>, res: Response) {
    const userId = res.locals.user._id;

    const timesheetId = req.params.timesheetId;
    const update = req.body;

    const timesheet = await findTimesheet({ _id: timesheetId });

    if (!timesheet) {
        return res.sendStatus(404);
    }

    if (String(timesheet.user?._id) !== userId) {
        return res.sendStatus(403);
    }

    const updatedTimesheet = await findAndUpdateTimesheet({ _id: timesheetId }, update, { new: true });

    try {
        if (updatedTimesheet?.completed === true) {
            // TODO: Update Xero Time Entry
            dayjs.extend(timezone)
            dayjs.tz.setDefault('Australia/Brisbane')

            let user = await findUser({ _id: updatedTimesheet?.user })
            let startDay = Number(updatedTimesheet?.startDate.split("/")[0]);
            let startMonth = Number(updatedTimesheet?.startDate.split("/")[1]) - 1;
            let startYear = Number(updatedTimesheet?.startDate.split("/")[2]);
            let startDate = dayjs().set('date', startDay).set('month', startMonth).set('year', startYear).format('YYYY-MM-DD')
            let endDay = Number(updatedTimesheet?.endDate.split("/")[0]);
            let endMonth = Number(updatedTimesheet?.endDate.split("/")[1]);
            let endYear = Number(updatedTimesheet?.endDate.split("/")[2]);
            let endDate = dayjs().set('date', endDay).set('month', endMonth).set('year', endYear).format('YYYY-MM-DD')

            let startHour = updatedTimesheet?.startHour
            let startMin = updatedTimesheet?.startMin / 60;

            let endHour = updatedTimesheet?.endHour;
            let endMin = updatedTimesheet?.endMin / 60;

            let hoursConverted = endHour - startHour

            let minsConverted = endMin - startMin;

            let totalHours = hoursConverted + minsConverted;

            let currentTimesheet = await findXeroTimesheet(user.xero?.currentTimesheetId)

            if (currentTimesheet) {

                let newNumOfUnits = [];
                let dayOfWeek = dayjs(startDate).day();

                let xeroDaysOfWeek = {
                    4: 0, // Thursday
                    5: 1, // Friday
                    6: 2, // Saturday
                    0: 3, // Sunday 
                    1: 4, // Monday
                    2: 5, // Tuesday
                    3: 6 // Wednesday
                }

                let xeroDayOfWeek = xeroDaysOfWeek[dayOfWeek];

                let currentNumOfUnits = currentTimesheet?.timesheet?.timesheetLines[0]?.numberOfUnits ? currentTimesheet.timesheet.timesheetLines[0].numberOfUnits : [];


                newNumOfUnits = [...currentNumOfUnits];

                newNumOfUnits[xeroDayOfWeek] = totalHours;

                let payload = [
                    {
                        employeeID: user.xero?.employeeId,
                        startDate: currentTimesheet?.timesheet?.startDate,
                        endDate: currentTimesheet?.timesheet?.endDate,
                        status: 'DRAFT',
                        timesheetID: user.xero?.currentTimesheetId,
                        timesheetLines: [
                            {
                                earningsRateID: user?.xero?.earningsRateId,
                                // Number of Units is spread over pay run (Thurs, Friday, Sat, Sun, Mon, Tue, Wed)
                                numberOfUnits: [...newNumOfUnits]
                            }
                        ]
                    }
                ]

                //@ts-ignore
                let xeroResponse = await createXeroTimesheet(payload);
            }
        }
    } catch (e: any) {
        logger.error(e.message);
        console.error(e.message);
        return res.status(422).send(e.message);
    }

    return res.send(updatedTimesheet);
}

export async function deleteTimesheetHandler(req: Request<DeleteTimesheetInput["params"]>, res: Response) {
    const userId = res.locals.user._id;

    const timesheetId = req.params.timesheetId;

    const timesheet = await findTimesheet({ _id: timesheetId });

    if (!timesheet) {
        return res.sendStatus(410);
    }

    if (String(timesheet.user?._id) !== userId) {
        return res.sendStatus(403)
    }

    await deleteTimesheet({ _id: timesheetId });

    return res.sendStatus(200);
}