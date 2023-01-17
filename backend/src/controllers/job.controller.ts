import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';
import { omit } from 'lodash';
import { Phone } from 'xero-node';
import { CreateClientInput, DeleteClientInput, UpdateClientInput } from '../schemas/client.schema';
import { CreateJobInput, DeleteJobInput, GetJobInput, UpdateJobInput } from '../schemas/job.schema';
import { CreateJobTaskInput } from '../schemas/jobtask.schema';
import { createClient, deleteClient, findAndUpdateClient, findClient, findClients } from '../services/client.service';
import { createJob, deleteJob, findAndUpdateJob, findJob, findJobs, getNextJobNumber } from '../services/job.service';
import { createJobFilesInTeamsChannel, createMicrosoftTeam, createMicrosoftTeamChannel, getAllTeamsList } from '../services/microsoft.service';
import { findStatus, findStatuses } from '../services/status.service';
import { createXeroContact, createXeroProject, getXeroContacts, getXeroProjects } from '../services/xero.service';
import logger from '../utils/logger';

export async function getNextJobNumberHandler(req: Request, res: Response) {
    try {
        const nextNumber = await getNextJobNumber();
        return res.send({ number: nextNumber });
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function createJobHandler(req: Request<{}, {}, CreateJobInput["body"]>, res: Response) {
    try {
        const nextJobNumber = await getNextJobNumber();
        const dateSubmitted = new Date(req.body.dateSubmitted);
        const reqDateOfQuote = new Date(req.body.reqDateOfQuote);
        const followUpDate = new Date(req.body.followUpDate);

        // @ts-ignore
        const client = await findClient({ _id: req.body.client })

        if (!client) {
            return res.send(422).send('No Client found!');
        }

        const teamsChannel = await createMicrosoftTeamChannel(client.teamsId, String(nextJobNumber), req.body.description)

        if (!teamsChannel) {
            return res.send(422).send('No Teams Channel Made!');
        }

        console.log('TEAMS CHANNEL', teamsChannel);
        console.log('TEAMS CHANNEL ID', teamsChannel.id);

        //@ts-ignore: Spread of body is complaining cause we already have dateSubmitted, reqDateofQuote and followUpDate, but they're strings
        const job = await createJob({ jobNo: nextJobNumber, dateSubmitted: dateSubmitted, reqDateOfQuote: reqDateOfQuote, followUpDate: followUpDate, ...req.body, fileReference: client.teamsId });

        if (!job) {
            return res.send(422).send('No Job found!');
        }

        const clientFromJob = await findClient({ _id: job.client });

        if (!clientFromJob) {
            return res.send(422).send('Client not found!');
        }

        const jobFiles = await createJobFilesInTeamsChannel(clientFromJob.teamsId, 'new', job.jobNo);
        console.log('jobFiles', jobFiles);
        return res.send(job)


    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function updateJobHandler(req: Request<UpdateJobInput["params"], UpdateJobInput["body"]>, res: Response) {
    try {

        const jobId = req.params.jobId;
        const update = req.body;

        const job = await findJob({ _id: jobId });

        if (!job) {
            return res.sendStatus(404);
        }

        // TODO:  Ensure admin/appropriate rank can remove/update a job
        // if (String(client._id) !== clientId) {
        //     return res.sendStatus(403);
        // }

        // const dateSubmitted = new Date(req.body.dateSubmitted);
        // const reqDateOfQuote = new Date(req.body.reqDateOfQuote);
        // const followUpDate = new Date(req.body.followUpDate);

        const jobStatusValue = await findStatus({ _id: update?.jobStatus ? update.jobStatus : '' });

        console.log('jobStatus', jobStatusValue);

        console.log('client', update.client);

        const clientFromJob = await findClient({ _id: String(update?.client) ? String(update.client) : '' })

        if (!clientFromJob) {
            return res.status(409).send('Client not found!');
        }

        if (jobStatusValue && jobStatusValue.status === 'Completed') {
            console.log('Completed Status!');

            let date = new Date();

            let updatedJob = await findAndUpdateJob({ _id: jobId }, { ...update, completedDate: date }, { new: true })

            return res.send(updatedJob);
        }

        if (jobStatusValue && jobStatusValue.status === 'Approved') {
            console.log('Approved Status');


            const jobFiles = await createJobFilesInTeamsChannel(clientFromJob.teamsId, 'approved', job.jobNo);
            console.log('jobFiles', jobFiles);


            // Check if Client exists in Xero - If exists check Client Xero ID and compare/overwrite.
            const xeroContacts = await getXeroContacts()

            if (!xeroContacts) {
                return res.status(409).send('Error retrieving Xero Contacts');
            }

            let xeroClientExists = xeroContacts.filter(contact => contact.name === clientFromJob?.name)

            console.log('xeroClientExists', xeroClientExists);

            // If Client Doesn't Exist - create Client in Xero and save Xero ID to Client Reference
            if (Object.keys(xeroClientExists).length <= 0) {
                // Create Client in Xero

                let phones = [];

                let phone = {
                    phoneNumber: update?.contact?.phone ? update.contact.phone : '0400 000 000',
                    phoneType: Phone.PhoneTypeEnum.MOBILE,
                }

                phones.push(phone);

                console.log('update client name', clientFromJob?.name)

                let contact = {
                    name: clientFromJob?.name ? clientFromJob.name : `UNKNOWN ${faker.random.alphaNumeric(4)}`,
                    emailAddress: update?.contact?.email ? update.contact.email : 'info@coasteelengineering.com.au',
                    phones: phones,
                    isCustomer: true,
                }

                let contacts = {
                    contacts: [contact]
                }

                let xeroClientCreated = await createXeroContact(contacts)

                console.log('xeroClientCreated', xeroClientCreated);

                // if (!xeroClientCreated) {
                //     return res.status(409).send('Error Creating Xero Client!');
                // }

                let xeroProjects = await getXeroProjects(1, 150);

                let xeroProjectExists = xeroProjects.items.filter(project => project.name.includes(String(update?.jobNo)))

                console.log('xeroProjectExists', xeroProjectExists);

                // If Project Doesn't Exist, Create Project in Xero

                if (Object.keys(xeroProjectExists).length <= 0 && xeroClientCreated) {

                    let payload = {
                        body: {
                            //@ts-ignore
                            contactId: xeroClientCreated && xeroClientCreated?.contacts[0]?.contactID,
                            name: String(update?.jobNo ? update.jobNo : 'UNKNOWN')
                        }
                    }

                    //@ts-ignore
                    let xeroProjectCreated = await createXeroProject(payload);

                    console.log('xeroProjectCreated', xeroProjectCreated);
                    if (!xeroProjectCreated) {
                        return res.status(409).send('Error creating project in Xero!')
                    }

                    let updateJob = await findAndUpdateJob({ _id: jobId }, { xeroReference: xeroProjectCreated.projectId, ...update }, { new: true })
                    //@ts-ignore
                    let updateClient = await findAndUpdateJob({ _id: clientFromJob._id }, { xeroId: xeroClientCreated && xeroClientCreated?.contacts[0]?.contactID }, { new: true })

                    if (!updateClient) {
                        return res.status(409).send('Could not update client!');
                    }
                    return res.send(updateJob);
                }
            } else {
                // If Client Exists, Check if Project exists with Job Number
                console.log('CONTACT FOUND, ID IS: ', xeroClientExists[0].contactID)
                console.log('Client Xero ID vs ContactID', clientFromJob.xeroId);
                let xeroProjects = await getXeroProjects(1, 150);

                let xeroProjectExists = xeroProjects.items.filter(project => project.name.includes(String(update?.jobNo)))

                console.log('xeroProjectExists', xeroProjectExists);

                if (clientFromJob.xeroId === "UNKNOWN") {
                    let updatedClient = await findAndUpdateClient({ _id: clientFromJob._id }, { xeroId: xeroClientExists[0].contactID }, { new: true });
                    //@ts-ignore
                    if (Object.keys(xeroProjectExists).length <= 0 && updatedClient?.xeroId !== "UNKNOWN") {

                        let payload = {
                            body: {
                                //@ts-ignore
                                contactId: updatedClient.xeroId,
                                name: String(update?.jobNo ? update.jobNo : 'UNKNOWN')
                            }
                        }

                        //@ts-ignore
                        let xeroProjectCreated = await createXeroProject(payload);

                        console.log('xeroProjectCreated', xeroProjectCreated);

                        if (!xeroProjectCreated) {
                            return res.status(409).send('Error creating project in Xero!')
                        }

                        let updateJob = await findAndUpdateJob({ _id: jobId }, { ...update, xeroReference: xeroProjectCreated.projectId }, { new: true })
                        return res.send(updateJob);
                    }
                } else {
                    if (Object.keys(xeroProjectExists).length <= 0 && clientFromJob.xeroId !== "UNKNOWN") {

                        let payload = {
                            body: {
                                //@ts-ignore
                                contactId: clientFromJob.xeroId,
                                name: String(update?.jobNo ? update.jobNo : 'UNKNOWN')
                            }
                        }

                        //@ts-ignore
                        let xeroProjectCreated = await createXeroProject(payload);

                        console.log('xeroProjectCreated', xeroProjectCreated);

                        if (!xeroProjectCreated) {
                            return res.status(409).send('Error creating project in Xero!')
                        }

                        let updateJob = await findAndUpdateJob({ _id: jobId }, { ...update, xeroReference: xeroProjectCreated.projectId }, { new: true })
                        return res.send(updateJob);
                    }

                }

            }
        }

        let xeroProjects = await getXeroProjects(1, 150);
        let xeroProjectExists = xeroProjects.items.filter(project => project.name.includes(String(update?.jobNo)))

        if (Object.keys(xeroProjectExists).length > 0) {
            console.log('updating xero reference');

            if (clientFromJob.xeroId === "UNKNOWN" || "NA") {
                let updateClient = await findAndUpdateClient({ _id: clientFromJob._id }, { xeroId: xeroProjectExists[0].contactId }, { new: true });
            }

            let updateJob = await findAndUpdateJob({ _id: jobId }, { ...update, xeroReference: xeroProjectExists[0].projectId }, { new: true })
            return res.send(updateJob);

        } else {
            let updateJob = await findAndUpdateJob({ _id: jobId }, { ...update }, { new: true })
            return res.send(updateJob);

        }


    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getJobsHandler(req: Request, res: Response) {
    try {
        if (Object.keys(req.query).length !== 0) {
            const query = req.query
            const jobs = await findJobs(query)
            return res.send(jobs);
        } else {
            const jobs = await findJobs({})
            return res.send(jobs);
        }
    } catch (e: any) {
        logger.error(e)
        return res.status(409).send(e.message);
    }
}

export async function getJobHandler(req: Request<GetJobInput["params"]>, res: Response) {
    try {
        //const userId = res.locals.user._id;
        const jobId = req.params.jobId;

        const job = await findJob({ _id: jobId })
        return res.send(job);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function deleteJobHandler(req: Request<DeleteJobInput["params"]>, res: Response) {
    const jobId = req.params.jobId;

    const job = await findJob({ jobId });

    if (!job) {
        return res.sendStatus(410);
    }

    // TODO: Check if user is admin

    await deleteJob({ jobId });

    return res.sendStatus(200);
}