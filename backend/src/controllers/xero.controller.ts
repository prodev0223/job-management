import { Request, Response } from 'express';
import logger from '../utils/logger';
import { createXeroProject, createXeroProjectTime, createXeroTimePayRun, createXeroTimesheet, findXeroTimesheet, getXeroContact, getXeroContacts, getXeroEmployees, getXeroProject, getXeroProjects, getXeroProjectTasks, getXeroTimesheets } from "../services/xero.service";
import { CreateXeroProjectInput, CreateXeroProjectTimeInput, CreateXeroTimesheetInput, GetXeroContactsInput, GetXeroProjectsInput, XeroContact, XeroProjectTask } from '../schemas/xero.schema';


export async function getXeroContactsHandler(req: Request<GetXeroContactsInput["query"]>, res: Response) {
    try {
        const contacts = await getXeroContacts();

        if (Object.keys(req.query).length !== 0) {
            const { id, name, isCustomer } = req.query;
            if (id !== undefined || null) {
                return res.send(Object.values(contacts).filter(contact => contact.contactID === id))
            }
            if (name !== undefined || null) {
                return res.send(Object.values(contacts).filter(contact => contact.name.toLowerCase().includes(String(name).toLowerCase())))
            }
            if (isCustomer !== undefined || null) {
                return res.send(contacts.filter(contact => String(contact.isCustomer) === isCustomer))
            }
        } else {
            return res.send(contacts);
        }
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getXeroEmployeesHandler(req: Request, res: Response) {
    try {
        const employees = await getXeroEmployees();

        // if (Object.keys(req.query).length !== 0) {
        //     const { id, name, isCustomer } = req.query;
        //     if (id !== undefined || null) {
        //         return res.send(Object.values(contacts).filter(contact => contact.contactID === id))
        //     }
        //     if (name !== undefined || null) {
        //         return res.send(Object.values(contacts).filter(contact => contact.name.toLowerCase().includes(String(name).toLowerCase())))
        //     }
        //     if (isCustomer !== undefined || null) {
        //         return res.send(contacts.filter(contact => String(contact.isCustomer) === isCustomer))
        //     }
        // } else {
        return res.send(employees);
        // }
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getXeroTimesheetsHandler(req: Request, res: Response) {
    try {
        const timesheets = await getXeroTimesheets();

        // if (Object.keys(req.query).length !== 0) {
        //     const { id, name, isCustomer } = req.query;
        //     if (id !== undefined || null) {
        //         return res.send(Object.values(contacts).filter(contact => contact.contactID === id))
        //     }
        //     if (name !== undefined || null) {
        //         return res.send(Object.values(contacts).filter(contact => contact.name.toLowerCase().includes(String(name).toLowerCase())))
        //     }
        //     if (isCustomer !== undefined || null) {
        //         return res.send(contacts.filter(contact => String(contact.isCustomer) === isCustomer))
        //     }
        // } else {
        return res.send(timesheets);
        // }
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getXeroProjectsHandler(req: Request<GetXeroProjectsInput["query"]>, res: Response) {
    try {
        const { name, projectId, contactId, page, pageSize } = req.query;
        const projects = await getXeroProjects(Number(page) || undefined, Number(pageSize) || undefined);

        if (Object.keys(req.query).length !== 0) {
            //console.log('projects', projects)
            if (projectId !== undefined || null) {
                console.log('projectId', Object.values(projects.items).filter(project => project.projectId === projectId));
                return res.send(Object.values(projects.items).filter(project => project.projectId === projectId));
            }
            if (contactId !== undefined || null) {
                return res.send(Object.values(projects.items).filter(project => project.contactId === contactId));
            }
            if (name !== undefined || null) {
                return res.send(Object.values(projects.items).filter(project => project.name.toLowerCase().includes(String(name).toLowerCase())));
            }

            return res.send(projects);
        } else {
            return res.send(projects);
        }

    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function createXeroProjectHandler(req: Request<CreateXeroProjectInput["body"]>, res: Response) {
    try {
        const project = await createXeroProject(req);
        return res.send(project);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function createXeroProjectTimeEntryHandler(req: Request<CreateXeroProjectTimeInput["params"], CreateXeroProjectTimeInput["body"]>, res: Response) {
    try {

        let date = new Date(req.body.dateUtc);
        console.log('req.body', req.body);

        const time = await createXeroProjectTime(req.params.projectId, { ...req.body, dateUtc: date });

        return res.send(time);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function createXeroTimesheetHandler(req: Request<CreateXeroTimesheetInput>, res: Response) {
    try {
        const timesheet = await createXeroTimesheet(req.body);
        return res.send(timesheet);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getXeroTimesheetHandler(req: Request, res: Response) {
    try {
        //@ts-ignore
        const timesheet = await findXeroTimesheet(req.params.timesheetId);
        return res.send(timesheet);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getXeroContactByIdHandler(req: Request, res: Response) {
    try {
        const { contactId } = req.params;

        if (!contactId) {
            return res.status(422).send('No Contact ID provided!');
        }

        const contact = await getXeroContact(contactId);
        return res.send(contact[0]);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getXeroProjectByIdHandler(req: Request, res: Response) {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(422).send('No Project ID provided!');
        }

        const project = await getXeroProject(projectId);
        return res.send(project);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getXeroProjectTasksByIdHandler(req: Request, res: Response) {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(422).send('No Project ID provided!');
        }

        const project = await getXeroProjectTasks(projectId);
        return res.send(project);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getXeroProjectStatsHandler(req: Request, res: Response) {
    try {
        const { projectId } = req.params;

        if (!projectId) {
            return res.status(422).send('No Project ID provided');
        }

        const project = await getXeroProject(projectId);

        if (!project) {
            return res.status(404).send('Project not found!')
        }

        let tasks = await getXeroProjectTasks(projectId)

        console.log('tassks', tasks);

        // let timeEstimated = tasks.items.reduce((a: XeroProjectTask, b) => Number(a?.estimateMinutes) ? Number(a.estimateMinutes) : 0 + Number(b?.estimateMinutes) ? Number(b.estimateMinutes) : 0, 0);
        // let timeSpent = tasks.items.reduce((a: XeroProjectTask, b) => Number(a?.totalMinutes) ? Number(a.totalMinutes) : 0 + Number(b?.totalMinutes) ? Number(b.totalMinutes) : 0, 0);


        let timeEstimated = tasks.items.reduce((prev, current) => {
            return prev + Number(current.estimateMinutes);
        }, 0)

        let timeSpent = tasks.items.reduce((prev, current) => {
            return prev + Number(current.totalMinutes);
        }, 0)

        console.log('timeEstimated', timeEstimated);
        console.log('timeSpent', timeSpent);

        return res.send({
            estimatedMinutes: timeEstimated,
            spentMinutes: timeSpent
        });

    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getXeroProjectsStatsHandler(req: Request, res: Response) {
    try {

        const projects = await getXeroProjects();

        if (Object.keys(projects.items).length <= 0) {
            return res.status(422).send('No projects found!');
        }



    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function createXeroTimePayRunHandler(req: Request, res: Response) {
    try {
        const payruns = await createXeroTimePayRun(req.body.startDate);

        return res.send(payruns)
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e);
    }
}