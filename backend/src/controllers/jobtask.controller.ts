import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';
import { Request, Response } from 'express';
import { omit } from 'lodash';
import { ChargeType } from 'xero-node/dist/gen/model/projects/chargeType';
import { CurrencyCode } from 'xero-node/dist/gen/model/projects/currencyCode';
import { CreateClientInput, DeleteClientInput, UpdateClientInput } from '../schemas/client.schema';
import { GetJobInput } from '../schemas/job.schema';
import { CreateJobTaskInput, DeleteJobTaskInput, GetJobTaskInput, GetJobTasksInput, UpdateJobTaskInput } from '../schemas/jobtask.schema';
import { createClient, deleteClient, findAndUpdateClient, findClient, findClients } from '../services/client.service';
import { findAndUpdateJob, findJob } from '../services/job.service';
import { createJobTask, createJobTaskTime, deleteJobTask, findAndUpdateJobTask, findAndUpdateJobTaskTime, findJobTask, findJobTaskById, findJobTasks, findJobTaskTime } from '../services/jobtask.service';
import { findAndUpdateUser, findUser } from '../services/user.service';
import { createXeroProjectTask, createXeroProjectTime, getXeroProjectUsers } from '../services/xero.service';
import logger from '../utils/logger';

export async function createJobTaskHandler(req: Request<CreateJobTaskInput["params"], CreateJobTaskInput["body"]>, res: Response) {
    try {
        const jobId = req.params.jobId;

        const job = await findJob({ _id: jobId });

        if (!job) {
            return res.status(404).send('Unable to find Job!');
        }

        const taskInXero = await createXeroProjectTask(job.xeroReference, {
            name: req.body?.taskDescription,
            rate: {
                currency: CurrencyCode.AUD,
                value: req.body.taskRate
            },
            chargeType: ChargeType.TIME,
            estimateMinutes: Number(req.body.estimatedHours * 60),
        })

        console.log('taskInXero', taskInXero);

        // if (!taskInXero) {
        // } else {
        //     const task = await createJobTask({ jobId: jobId, xeroId: taskInXero.projectId, ...req.body })
        // }

        const task = await createJobTask({ jobId: jobId, xeroId: taskInXero.taskId, ...req.body });
        return res.send(task)

    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function createJobTaskTimeHandler(req: Request, res: Response) {
    try {
        const taskId = req.params.taskId;

        const task = await findJobTask({ _id: taskId });

        if (!task) {
            return res.status(404).send('Unable to find Task!');
        }

        const taskTimeEntry = await createJobTaskTime({
            user: req.body.user,
            taskId: task._id,
            startDay: req.body.startDay,
            startHour: req.body.startHour,
            startMin: req.body.startMin,
            endDay: req.body.endDay,
            endHour: req.body.endHour,
            endMin: req.body.endMin,
            completed: false,
        })


        if (taskTimeEntry) {
            let updatePayload = [...task?.timeEntries, taskTimeEntry._id]
            let updatedTask = await findAndUpdateJobTask({ _id: taskId }, { timeEntries: updatePayload }, { new: true })

            let updateUser = await findAndUpdateUser({ _id: req.body.user }, { activeTask: taskTimeEntry._id }, { new: true });
            console.log('updated user', updateUser)
            console.log('updated task', updatedTask)
        }

        return res.send(taskTimeEntry);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function updateJobTaskTimeHandler(req: Request, res: Response) {
    try {
        const taskId = req.params.taskId;
        const timeEntryId = req.params.timeEntryId;
        const userId = res.locals.user._id;

        const user = await findUser({ _id: userId });

        if (!user) {
            return res.status(404).send('Unable to find User!');
        }

        console.log('user', user.xero?.employeeId);

        let projectUsers = await getXeroProjectUsers(1, 150);

        if (!projectUsers) {
            return res.status(404).send('Unable to retrieve Project Users!');
        }

        console.log('projectUsers', projectUsers);

        // return res.send(projectUsers);

        const task = await findJobTask({ _id: taskId });

        if (!task) {
            return res.status(404).send('Unable to find Task!');
        }

        console.log('task', task)

        if (!timeEntryId) {
            return res.status(422).send('No Time Entry ID found!');
        }

        const taskTime = await findJobTaskTime({ _id: timeEntryId });

        if (!taskTime) {
            return res.status(404).send('Unable to find Task Time Entry!');
        }

        if (req.body.completed !== false) {
            console.log('completed has been indicated!');
            console.log('xero ID of task', task.xeroId);

            let hours = req.body.endHour - taskTime.startHour;
            let minutes = req.body.endMin - taskTime.startMin;

            console.log('hours', hours);
            console.log('minutes', minutes);

            let duration = (hours * 60) + minutes;

            console.log('duration in minutes', duration);

            dayjs.extend(timezone);
            dayjs.tz.setDefault('Australia/Brisbane');

            let month = taskTime.startDay.split('/')[0]
            let day = taskTime.startDay.split('/')[1]
            let year = taskTime.startDay.split('/')[2]

            console.log('day', day)
            console.log('month', month)
            console.log('year', year)

            let dateStartDay = new Date(month + '/' + day + '/' + year)
            console.log(dateStartDay)
            console.log('dayjs(dateStartDay).toDate();', dayjs(taskTime.startDay).toDate())
            let createTimeInXero = await createXeroProjectTime(task.jobId.xeroReference, {
                userId: "c4c4e507-5902-472c-bea4-167e468d3962",
                taskId: task.xeroId,
                dateUtc: dateStartDay,
                duration: duration
            })

            console.log('createdTimeInXero', createTimeInXero);
        }

        const updatedTaskTime = await findAndUpdateJobTaskTime({ _id: taskTime._id }, { ...req.body }, { new: true })
        return res.send(updatedTaskTime)

    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function updateJobTaskHandler(req: Request<UpdateJobTaskInput["params"]>, res: Response) {
    try {

        const jobId = req.params.jobId;
        const taskId = req.params.taskId;

        const user = await findUser({ _id: res.locals.user?._id });

        const update = req.body;

        const task = await findJobTask({ _id: taskId });

        if (!task) {
            return res.sendStatus(404);
        }

        console.log('task', task);
        console.log(':jobId', jobId)

        console.log(`${task.jobId?._id} | ${jobId}`);

        if (!user) {
            return res.sendStatus(409)
        } else {
            console.log('user', user);
        }

        if (String(task.jobId?._id) !== jobId) {
            return res.sendStatus(403);
        }

        // TODO:  Ensure admin/appropriate rank can remove/update a task
        // if (String(client._id) !== clientId) {
        //     return res.sendStatus(403);
        // }

        // Check if there is a time entry on this task update
        const updatedTask = await findAndUpdateJobTask({ _id: taskId }, update, { new: true })
        return res.send(updatedTask);

    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getAllJobTasksHandler(req: Request, res: Response) {
    try {
        if (Object.keys(req.query).length !== 0) {
            const query = req.query
            const tasks = await findJobTasks(query)
            return res.send(tasks);
        } else {
            const tasks = await findJobTasks({})
            return res.send(tasks);
        }
    } catch (e: any) {
        logger.error(e)
        return res.status(409).send(e.message);
    }
}

export async function getJobTasksHandler(req: Request<GetJobTasksInput["params"]>, res: Response) {
    try {
        let job = await findJob({ _id: req.params.jobId })

        if (!job) {
            return res.sendStatus(404);
        }

        if (String(job._id) !== req.params.jobId) {
            return res.sendStatus(403);
        }

        if (Object.keys(req.query).length !== 0) {
            const query = req.query
            const tasks = await findJobTasks(query)
            return res.send(tasks);
        } else {
            const tasks = await findJobTasks({ jobId: req.params.jobId })
            return res.send(tasks);
        }
    } catch (e: any) {
        logger.error(e)
        return res.status(409).send(e.message);
    }
}

export async function getJobTaskHandler(req: Request<GetJobTaskInput["params"]>, res: Response) {
    try {

        const jobId = req.params.jobId;
        const taskId = req.params.taskId;

        const task = await findJobTask({ _id: taskId })

        if (!task) {
            return res.sendStatus(404);
        }

        if (String(task.jobId?._id) !== jobId) {
            return res.sendStatus(403);
        }

        return res.send(task);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getJobTaskByIdHandler(req: Request, res: Response) {
    try {
        const taskId = req.params.taskId;
        console.log({taskId})
        const task = await findJobTaskById(taskId);

        if (!task) {
            return res.sendStatus(404);
        }

        return res.send(task);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getJobTaskTimesByIdHandler(req: Request, res: Response) {
    try {
        const taskId = req.params.taskId;

        if (!taskId) {
            return res.sendStatus(404);
        }

        const task = await findJobTaskById(taskId);

        if (!task) {
            return res.sendStatus(404);
        }

        return res.send(task?.timeEntries ? task.timeEntries : []);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function deleteJobTaskHandler(req: Request<DeleteJobTaskInput["params"]>, res: Response) {
    const jobId = req.params.jobId;
    const taskId = req.params.taskId;

    const task = await findJobTask({ _id: taskId });


    if (!task) {
        return res.sendStatus(410);
    }

    if (String(task.jobId?._id) !== jobId) {
        return res.sendStatus(409);
    }

    // TODO: Check if user is admin

    await deleteJobTask({ _id: taskId });

    return res.sendStatus(200);
}