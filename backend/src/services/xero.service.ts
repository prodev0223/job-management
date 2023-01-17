import { XeroClient } from 'xero-node';
import { CreateXeroContactInput, CreateXeroProjectInput, CreateXeroTimesheetInput, XeroContact, XeroProject, XeroProjects, XeroProjectTask, XeroProjectTasks } from '../schemas/xero.schema';
import _ from 'lodash';
import { ProjectStatus } from 'xero-node/dist/gen/model/projects/projectStatus';
import { TaskCreateOrUpdate } from 'xero-node/dist/gen/model/projects/taskCreateOrUpdate';
import { TimeEntryCreateOrUpdate } from 'xero-node/dist/gen/model/projects/timeEntryCreateOrUpdate';
import { findAndUpdateUser, findUsers } from './user.service';
import { FlattenMaps, _LeanDocument } from 'mongoose';
import dayjs from 'dayjs';
import { TimesheetStatus } from 'xero-node/dist/gen/model/payroll-au/timesheetStatus';
require('dotenv').config();

const clientId = process.env.XERO_CLIENT_ID
const clientSecret = process.env.XERO_CLIENT_SECRET

if (!clientId) {
    throw new Error('unable to find xeroClientId!');
}

if (!clientSecret) {
    throw new Error('unable to find xeroClientSecret!');
}

const xero = new XeroClient({
    clientId: clientId,
    clientSecret: clientSecret,
    grantType: 'client_credentials'
})



export async function connectToXero(): Promise<void> {
    let token = await xero.getClientCredentialsToken().then((token) => {
        return token
    }).catch((error) => {
        return error
    });
    console.log({token})
    return token;
}

export async function getXeroEmployees(): Promise<any[]> {
    await connectToXero();

    let employees = await xero.payrollAUApi.getEmployees('').then((employees) => {
        return employees.body.employees;
    }).catch((error) => {
        return error;
    })

    return employees;
}

export async function getXeroTimesheets(): Promise<any[]> {
    await connectToXero();

    let timesheets = await xero.payrollAUApi.getTimesheets('').then((timesheets) => {
        return timesheets.body.timesheets;
    }).catch((error) => {
        return error;
    })

    return timesheets;
}

export async function getXeroContacts(): Promise<XeroContact[]> {
    await connectToXero();

    let contacts = await xero.accountingApi.getContacts('').then((contacts) => {
        return contacts.body.contacts;
    }).catch((error) => {
        return error;
    });
    return contacts;
}

export async function getXeroContact(id: string): Promise<XeroContact[]> {
    await connectToXero();

    let contact = await xero.accountingApi.getContact('', id).then((contact) => {
        return contact.body.contacts;
    }).catch((error) => {
        return error;
    });
    return contact;
}

export async function getXeroProjectTasks(id: string): Promise<XeroProjectTasks> {
    await connectToXero();

    let tenants = await xero.updateTenants(false)
    console.log({tenants})
    let tenantId = tenants[0].tenantId

    let project = await xero.projectApi.getTasks(tenantId, id).then((project) => {
        return project.body;
    }).catch((error) => {
        return error;
    });
    return project;
}

export async function getXeroProject(id: string): Promise<XeroProject> {
    await connectToXero();

    let project = await xero.projectApi.getProject('', id).then((project) => {
        return project.body;
    }).catch((error) => {
        return error;
    });
    return project;
}

export async function getXeroProjects(page: number = 1, pageSize: number = 100): Promise<XeroProjects> {
    await connectToXero();

    let projects = await xero.projectApi.getProjects("", undefined, undefined, String(ProjectStatus.INPROGRESS), page, pageSize).then((projects) => {
        return {
            items: projects.body.items,
            pagination: projects.body?.pagination
        }
    }).catch((error) => {
        return error;
    })

    return projects;
}

export async function getXeroProjectUsers(page: number = 1, pageSize: number = 100) {
    await connectToXero();

    let projectUsers = await xero.projectApi.getProjectUsers("", page, pageSize).then((response) => {
        console.log('response', response);
        return response.body;
    }).catch((error) => {
        throw new Error(JSON.stringify(error.response.body, null, 2))
    })

    return projectUsers
}

export async function createXeroContact(input: any) {
    await connectToXero();

    //@ts-ignore
    let response = await xero.accountingApi.createContacts("", input).then((response) => {
        console.log('response', response);
        return response.body;
    }).catch((error) => {
        throw new Error(JSON.stringify(error.response.body, null, 2));
    })
    console.log(response);
    return response;
}

export async function createXeroProject(input: CreateXeroProjectInput) {
    await connectToXero();

    console.log('input', input.body);

    let response = await xero.projectApi.createProject("", input.body).then((response) => {
        console.log('response', response);
        return response.body;
    }).catch((error) => {
        throw new Error(JSON.stringify(error.response.body, null, 2));
    });
    console.log(response);
    return response;
}

export async function createXeroTimesheet(input: CreateXeroTimesheetInput[]) {
    await connectToXero();

    console.log('input', input);

    let response = await xero.payrollAUApi.createTimesheet("", input).then((response) => {
        console.log('response', response)
        return response.body;

    }).catch((error) => {
        //console.error('error!', JSON.stringify(error.response.body, null, 2));
        throw new Error(JSON.stringify(error.response.body, null, 2));
    })
    console.log(response);
    return response;
}

export async function createXeroProjectTime(id: string, input: TimeEntryCreateOrUpdate) {
    await connectToXero();

    let tenants = await xero.updateTenants(false)
    let tenantId = tenants[0].tenantId
    console.log("xeroTenantId")
    console.log({tenantId})

    let response = await xero.projectApi.createTimeEntry(tenantId, id, input).then((response) => {
        // console.log('response', response.body);
        return response.body;
    }).catch((error) => {
        // console.log('error', error);
        throw new Error(JSON.stringify(error, null, 2))
    })

    return response;
}

export async function createXeroProjectTask(id: string, input: TaskCreateOrUpdate) {
    await connectToXero();

    let tenants = await xero.updateTenants(false)
    let tenantId = tenants[0].tenantId
    console.log({tenantId, id})

    let response = await xero.projectApi.createTask(tenantId, id, input).then((response) => {
        console.log('response', response)
        return response.body;
    }).catch((error) => {
        throw new Error(JSON.stringify(error.response.body, null, 2));
    })

    return response;
}

export async function findXeroTimesheet(timesheetId: string) {
    await connectToXero();

    try {

        let response = await xero.payrollAUApi.getTimesheet("", timesheetId).then((response) => {
            return response.body;
        }).catch((error) => {
            throw new Error(JSON.stringify(error.response.body, null, 2));
        })
        return response;
    } catch (e: any) {
        return e
    }

}

export async function createXeroTimePayRun(startDate: string) {
    try {


        // Connect to Xero
        await connectToXero();

        // Get current Users from Mongo DB and Compare against Xero Employees where XeroID matches

        let xeroEmps = await getXeroEmployees();

        let dbUsers = await findUsers({});

        let merged: (boolean | _.Omit<FlattenMaps<Omit<_LeanDocument<any>, "$assertPopulated" | "$getAllSubdocs" | "$ignore" | "$isDefault" | "$isDeleted" | "$getPopulatedDocs" | "$isEmpty" | "$isValid" | "$locals" | "$markValid" | "$model" | "$op" | "$session" | "$set" | "$where" | "baseModelName" | "collection" | "db" | "delete" | "deleteOne" | "depopulate" | "directModifiedPaths" | "equals" | "errors" | "get" | "getChanges" | "increment" | "init" | "invalidate" | "isDirectModified" | "isDirectSelected" | "isInit" | "isModified" | "isNew" | "isSelected" | "markModified" | "modifiedPaths" | "modelName" | "overwrite" | "$parent" | "populate" | "populated" | "remove" | "replaceOne" | "save" | "schema" | "set" | "toJSON" | "toObject" | "unmarkModified" | "update" | "updateOne" | "validate" | "validateSync" | "$isSingleNested">>, "password" | "pinCode">)[] = [];

        dbUsers.forEach(async user => {
            console.log('checking', user.firstName + ' ' + user.lastName + ' - ' + user.xero?.employeeId)
            let match = xeroEmps.find(x => x.employeeID === user?.xero?.employeeId)

            console.log('match', match);
            if (match !== undefined) {
                console.log('FOUND MATCH', user.firstName + ' ' + user.lastName + ' - ' + match.employeeID)

                console.log('startDate', startDate);

                let frmStartDate = dayjs(startDate).format('YYYY-MM-DD');
                console.log('frmStartDate', frmStartDate);

                let frmEndDate = dayjs(frmStartDate).add(7, 'day')


                console.log('frmStartDate', frmStartDate);
                console.log('frmEndDate', frmEndDate.toISOString().split('T')[0])
                // Create Timesheet for Pay Run timeline via Node-Schedule per Employee found
                let response = await xero.payrollAUApi.createTimesheet("", [{
                    employeeID: match.employeeID,
                    startDate: frmStartDate,
                    endDate: frmEndDate.toISOString().split('T')[0],
                    status: TimesheetStatus.DRAFT,
                    timesheetLines: [
                        {
                            earningsRateID: match.ordinaryEarningsRateID,
                            numberOfUnits: [
                                0,
                                0,
                                0,
                                0,
                                0,
                                0,
                                0
                            ]
                        }
                    ]
                }]).then((response) => {
                    // console.log('response', response)
                    return response.body;

                }).catch((error) => {
                    console.error('error!', JSON.stringify(error.response.body, null, 2));
                    //throw new Error(JSON.stringify(error.response.body, null, 2));
                })
                // console.log(response);

                // return response;
                merged.push({
                    email: user.email,
                    userId: user._id,
                    xero: {
                        earningsRateId: match.ordinaryEarningsRateID,
                        employeeId: match.employeeID,
                        currentTimesheetId: response?.timesheets ? response.timesheets[0].timesheetID : 'UNKNOWN',
                        previousTimesheetId: user?.xero?.currentTimesheetId ? user.xero.currentTimesheetId : ''
                    }
                });

                // Set user EarningsID from Xero Employee Found
                // Save Timesheet ID for the User in Mongo DB
                let updateUser = await findAndUpdateUser(
                    {
                        _id: user._id
                    },
                    {
                        xero: {
                            earningsRateId: match.ordinaryEarningsRateID,
                            employeeId: match.employeeID,
                            currentTimesheetId: response?.timesheets ? response.timesheets[0].timesheetID : 'UNKNOWN',
                            previousTimesheetId: user?.xero?.currentTimesheetId ? user.xero.currentTimesheetId : ''
                        }
                    },
                    {
                        new: true
                    }
                )



                console.log('updatedUser', updateUser);

                console.log('merged', merged);

            }
        })

        return merged;
    } catch (e: any) {
        console.log('e', e);
        return e;
    }


    // Return Created Timesheets

}