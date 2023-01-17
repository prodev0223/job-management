import { faker } from '@faker-js/faker';
import { type } from 'os';
import ClientModel, { ClientDocument } from '../models/client.model';
import JobModel, { JobDocument } from '../models/job.model';
import RoleModel from '../models/role.model';
import StatusModel, { StatusDocument } from '../models/status.model';
import UserModel, { UserDocument } from '../models/user.model';
import { CreateClientInput } from '../schemas/client.schema';
import { CreateJobInput, CreateJobSeedInput } from '../schemas/job.schema';
import { createClient } from '../services/client.service';
import { createJob, getNextJobNumber } from '../services/job.service';
import { createJobTask } from '../services/jobtask.service';
import connect from './connect';
import coasteelClientsFromXero from '../seed/coasteelClientsFromXero';
import coasteelProjectsFromXero from '../seed/coasteelProjectsFromXero';

export function createRandomClient() {
    return {
        //@ts-ignore
        body: {
            name: faker.company.companyName(),
            xeroId: faker.datatype.uuid(),
            teamsId: faker.datatype.uuid(),
            isActive: true
        }
    }
}

export async function getRandomClient(): Promise<ClientDocument> {

    let count = await ClientModel.count()
    let random = Math.floor(Math.random() * count)
    let client = await ClientModel.findOne().skip(random);
    if (!client) {
        throw new Error('no client!');
    }
    return client;
}

export async function getRandomUser(): Promise<UserDocument> {
    let count = await UserModel.count();
    let random = Math.floor(Math.random() * count)
    let user = await UserModel.findOne().skip(random);
    if (!user) {
        throw new Error('no user!');
    }
    return user;
}

export async function getRandomStatus(type: string): Promise<StatusDocument> {
    let count = await StatusModel.count();
    let random = Math.floor(Math.random() * count);
    let status = await StatusModel.findOne().skip(random);

    if (!status) {
        throw new Error(`no status for type ${type}`);
    }

    return status
}

export async function getRandomJob(): Promise<JobDocument> {
    let count = await JobModel.count();
    let random = Math.floor(Math.random() * count);
    let job = await JobModel.findOne().skip(random);

    if (!job) {
        throw new Error('No job!');
    }
    return job;
}

export async function getRandomTaskType() {
    let types = [
        'Fabrication',
        'Processing',
        'Painting',
        'Site Work',
        'Detailing',
        'Yard',
        'Admin – Projects',
        'Admin – General',
        'Maintenance',
        'WHS',
    ]
    let count = types.length;
    let random = Math.floor(Math.random() * count);
    let type = types[random];

    return type;
}

export async function createRandomJob(jobNumber: number) {
    let date = faker.date.between('2022-01-01T00:00:00.000Z', '2022-12-31T00:00:00.000Z')
    let client = await getRandomClient();
    let jobStatus = await getRandomStatus('Job')
    let quoteStatus = await getRandomStatus('Quote');
    return {
        body: {
            jobNo: jobNumber,
            dateSubmitted: date,
            client: client._id,
            description: faker.lorem.lines(),
            doAndCharge: faker.datatype.boolean(),
            jobStatus: jobStatus._id,
            quoteStatus: quoteStatus._id,
            reqDateOfQuote: date,
            followUpDate: date,
            estimator: `${faker.name.firstName()} ${faker.name.lastName()}`,
            contractorNotes: faker.lorem.text(),
            notes: faker.lorem.text(),
            fileReference: faker.datatype.uuid(),
            xeroReference: faker.datatype.uuid()
        }
    }
}

export async function createRandomJobTask() {
    //let date = faker.date.between('2022-01-01T00:00:00.000Z', '2022-12-31T00:00:00.000Z');
    let user = await getRandomUser();
    let job = await getRandomJob();
    let taskType = await getRandomTaskType();
    return {
        body: {
            jobId: job._id,
            user: user._id,
            taskType: taskType,
            taskDescription: faker.lorem.sentence(15),
            status: 'New'
        }
    }
}

export async function roleSeedData() {
    await connect();
    let roles = [
        'Boilermaker',
        'Apprentice',
        'Yardsman',
        'Painter/Labourer',
        'Project Manager',
        'Workshop Manager',
        'Workshop Supervisor',
        'Office Management',
        'Super Admin'
    ]

    //let role = roles[Math.floor(Math.random() * roles.length)];

    for (let i = 0; i < roles.length; i++) {
        console.log(roles[i]);
        await RoleModel.create({ name: roles[i] })
    }
}

export async function jobSeedData() {
    await connect()
    const Jobs: CreateJobSeedInput[] = [];

    let jobNumber = await getNextJobNumber();

    for (let index = 0; index < 10; index++) {
        const job = await createRandomJob(jobNumber++)
        Jobs.push(job);

    }

    Object.values(Jobs).forEach(async job => {
        await createJob(job.body);

    })
}

export async function jobTaskSeedData() {
    await connect();
    const Tasks = [];

    for (let index = 0; index < 50; index++) {
        const task = await createRandomJobTask();
        Tasks.push(task)
    }

    Object.values(Tasks).forEach(async task => {
        //@ts-ignore
        await createJobTask(task.body)
    })
    console.log('Tasks', Tasks);
}

export async function clientSeedData() {
    await connect()
    const Clients: CreateClientInput[] = [];



    Array.from({ length: 10 }).forEach(() => {
        return Clients.push(createRandomClient());

    })

    Object.values(Clients).forEach(async client => {
        await createClient(client.body);

    })

    console.log('clients', Clients)
}


export async function clientSeedFromJSON() {
    await connect();

    const clients = coasteelClientsFromXero.map(async client => {
        console.log('client', client.name);
        let clientStatus = client.contactStatus === "ACTIVE" ? true : false
        //@ts-ignore
        let payload = {
            name: client.name,
            xeroId: client?.contactID,
            teamsId: 'UNKNOWN',
            isActive: clientStatus
        }

        await createClient(payload);
    })

    console.log('Iterate through: ', clients.length)
}

export async function projectSeedFromXero() {
    await connect();

    const projects = coasteelProjectsFromXero.filter(project => project.status !== 'CLOSED').map(async project => {
        console.log('Project Name:', project.name);
        console.log('Project Status:', project.status);
    })

    console.log('projects count', projects.length);
}

//projectSeedFromXero()
clientSeedFromJSON();

//clientSeedData();
//jobSeedData();
//roleSeedData();
//jobTaskSeedData();