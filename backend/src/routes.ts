import { Express, Request, Response } from 'express';
import { createClientHandler, deleteClientHandler, getClientHandler, getClientsHandler, updateClientHandler } from './controllers/client.controller';
import { createJobHandler, deleteJobHandler, getJobHandler, getJobsHandler, getNextJobNumberHandler, updateJobHandler } from './controllers/job.controller';
import { createJobTaskHandler, deleteJobTaskHandler, getJobTaskHandler, getAllJobTasksHandler, getJobTasksHandler, updateJobTaskHandler, getJobTaskByIdHandler, createJobTaskTimeHandler, updateJobTaskTimeHandler, getJobTaskTimesByIdHandler } from './controllers/jobtask.controller';
import { createJobFilesInTeamsChannelHandler, createMicrosoftTeamHandler, createMicrosoftTeamHandler, getAllTeamsListHandler, getMicrosoftChannelsByTeamIdHandler, getMicrosoftTeamsByIdHandler, getTeamsChannelByIdHandler } from './controllers/microsoft.controller';
import { createRoleHandler, deleteRolesHandler, getRoleHandler, getRolesHandler, updateRoleHandler } from './controllers/role.controller';
import { createProdUserSessionHandler, createUserSessionHandler, deleteSessionHandler, getUserSessionsHandler, azureOAuthHandler } from './controllers/session.controller';
import { createStatusHandler, deleteStatusHandler, getStatusesHandler, getStatusHandler, updateStatusHandler } from './controllers/status.controller';
import { createTimesheetHandler, deleteTimesheetHandler, getTimesheetsHandler, updateTimesheetHandler } from './controllers/timesheet.controller';
import { createUserHandler, getCurrentUserHandler, getUserHandler, getUsersHandler, updateUserHandler } from './controllers/user.controller';
import { createXeroProjectHandler, createXeroProjectTimeEntryHandler, createXeroTimePayRunHandler, createXeroTimesheetHandler, getXeroContactByIdHandler, getXeroContactsHandler, getXeroEmployeesHandler, getXeroProjectByIdHandler, getXeroProjectsHandler, getXeroProjectStatsHandler, getXeroProjectTasksByIdHandler, getXeroProjectTasksByIdHandler, getXeroTimesheetHandler, getXeroTimesheetsHandler } from './controllers/xero.controller';
import requireUser from './middleware/requireUser';
import validate from './middleware/validateResource';
import validateResource from './middleware/validateResource';
import { createClientSchema, deleteClientSchema, updateClientSchema } from './schemas/client.schema';
import { createJobSchema, deleteJobSchema, updateJobSchema } from './schemas/job.schema';
import { createJobTaskSchema, deleteJobTaskSchema, getJobTaskSchema, getJobTasksSchema, updateJobTaskSchema } from './schemas/jobtask.schema';
import { createRoleSchema, deleteRoleSchema, updateRoleSchema } from './schemas/role.schema';
import { createKioskSessionSchema, createSessionSchema } from './schemas/session.schema';
import { createStatusSchema, deleteStatusSchema, updateStatusSchema } from './schemas/status.schema';
import { createTimesheetSchema, deleteTimesheetSchema, updateTimesheetSchema } from './schemas/timesheet.schema';
import { createUserSchema, updateUserSchema } from './schemas/user.schema';

function routes(app: Express) {

    // General Routes 
    /**
     * @openapi
     * /api/healthcheck:
     *  get:
     *      tag: 
     *        - Healthcheck
     *      description: Responds if the app is up and running
     *      responses:
     *          200: 
     *              description: Returns a string    

     */
    app.get('/api/healthcheck', (req: Request, res: Response) => res.sendStatus(200))

    // User Routes
    app.get('/api/me', requireUser, getCurrentUserHandler);
    /**
     * @openapi
     * '/api/users':
     *  post: 
     *    tags:
     *      - User
     *    summary: Register a User
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema: 
     *            $ref: '#/components/schemas/CreateUserInput'
     *    responses: 
     *      200:
     *        description: Success
     *        content: 
     *          application/json:
     *            schema: 
     *            $ref: '#/components/schemas/CreateUserResponse'
     *      409:
     *        description: Conflict
     *      400:
     *        description: Bad Request
     */
    app.post('/api/users', validateResource(createUserSchema), createUserHandler);
    /**
     * @openapi
     * '/api/users':
     *  get: 
     *    tags:
     *      - User
     *    summary: Get all Users
     *    responses: 
     *      200:
     *        description: Success
     *        content: 
     *          application/json:
     *            schema: 
     *            $ref: '#/components/schemas/GetUserResponse'
     *      409:
     *        description: Conflict
     *      403:
     *        description: Forbidden
     *      400:
     *        description: Bad Request
     */
    app.get('/api/users', requireUser, getUsersHandler);
    app.get('/api/users/:userId', requireUser, getUserHandler);
    app.put('/api/users/:userId', [requireUser, validateResource(updateUserSchema)], updateUserHandler);

    // Session Routes
    /**
     * @openapi
     * '/api/sessions':
     *  post: 
     *    tags:
     *      - Session
     *    summary: Create a Session
     *    requestBody:
     *      required: true
     *      content:
     *        application/json:
     *          schema: 
     *            $ref: '#/components/schemas/CreateSessionInput'
     *    responses: 
     *      200:
     *        description: Success
     *        content: 
     *          application/json:
     *            schema: 
     *            $ref: '#/components/schemas/CreateSessionResponse'
     *      409:
     *        description: Conflict
     *      403:
     *        description: Forbidden
     *      400:
     *        description: Bad Request
     */
    app.post('/api/sessions', validateResource(createSessionSchema), createUserSessionHandler);
    app.post('/api/sessions/kiosk', validateResource(createKioskSessionSchema), createProdUserSessionHandler);
    app.get('/api/sessions', requireUser, getUserSessionsHandler);
    app.get('/api/sessions/oauth/azure', azureOAuthHandler);
    app.delete('/api/sessions', requireUser, deleteSessionHandler);

    // Role Routes
    app.post('/api/roles', [requireUser, validateResource(createRoleSchema)], createRoleHandler);
    app.get('/api/roles', requireUser, getRolesHandler);
    app.get('/api/roles/:roleId', requireUser, getRoleHandler);
    app.put('/api/roles/:roleId', [requireUser, validateResource(updateRoleSchema)], updateRoleHandler);
    app.delete('/api/roles/:roleId', [requireUser, validateResource(deleteRoleSchema)], deleteRolesHandler);

    // Timesheet Routes
    app.post('/api/timesheets', [requireUser, validateResource(createTimesheetSchema)], createTimesheetHandler)
    app.get('/api/timesheets', requireUser, getTimesheetsHandler);
    app.put('/api/timesheets/:timesheetId', [requireUser, validateResource(updateTimesheetSchema)], updateTimesheetHandler);
    app.delete('/api/timesheets/:timesheetId', [requireUser, validateResource(deleteTimesheetSchema)], deleteTimesheetHandler);

    // Status Routes
    app.post('/api/status', [requireUser, validateResource(createStatusSchema)], createStatusHandler);
    app.get('/api/status', [requireUser], getStatusesHandler);
    app.put('/api/status/:statusId', [requireUser, validateResource(updateStatusSchema)], updateStatusHandler);
    app.delete('/api/status/:statusId', [requireUser, validateResource(deleteStatusSchema)], deleteStatusHandler);

    // Client Routes
    app.post('/api/clients', [requireUser, validateResource(createClientSchema)], createClientHandler);
    app.get('/api/clients', [requireUser], getClientsHandler);
    app.get('/api/clients/:clientId', [requireUser], getClientHandler);
    app.put('/api/clients/:clientId', [requireUser, validateResource(updateClientSchema)], updateClientHandler);
    app.delete('/api/clients/:clientId', [requireUser, validateResource(deleteClientSchema)], deleteClientHandler);

    // Job Routes
    app.post('/api/jobs', [requireUser, validateResource(createJobSchema)], createJobHandler);
    app.get('/api/jobs/next', [requireUser], getNextJobNumberHandler);
    app.get('/api/jobs/:jobId', [requireUser], getJobHandler);
    app.get('/api/jobs', [requireUser], getJobsHandler);
    app.put('/api/jobs/:jobId', [requireUser, validateResource(updateJobSchema)], updateJobHandler);
    app.delete('/api/jobs/:jobId', [requireUser, validateResource(deleteJobSchema)], deleteJobHandler);

    // Job Task Routes
    app.get('/api/tasks/:taskId', [requireUser], getJobTaskByIdHandler);
    app.get('/api/tasks/:taskId/times', [requireUser], getJobTaskTimesByIdHandler);
    app.post('/api/tasks/:taskId/times', [requireUser], createJobTaskTimeHandler);
    app.put('/api/tasks/:taskId/times/:timeEntryId', [requireUser], updateJobTaskTimeHandler);
    app.get('/api/tasks', [requireUser], getAllJobTasksHandler);
    app.post('/api/jobs/:jobId/tasks', [requireUser, validateResource(createJobTaskSchema)], createJobTaskHandler);
    app.get('/api/jobs/:jobId/tasks', [requireUser, validateResource(getJobTasksSchema)], getJobTasksHandler);
    app.put('/api/jobs/:jobId/tasks/:taskId', [requireUser, validateResource(updateJobTaskSchema)], updateJobTaskHandler);
    app.delete('/api/jobs/:jobId/tasks/:taskId', [requireUser, validateResource(deleteJobTaskSchema)], deleteJobTaskHandler);


    app.get('/api/microsoft/teams', [requireUser], getAllTeamsListHandler);
    app.post('/api/microsoft/teams', [requireUser], createMicrosoftTeamHandler);
    app.get('/api/microsoft/teams/:teamsId', [requireUser], getMicrosoftTeamsByIdHandler);
    app.get('/api/microsoft/teams/:teamsId/channels', [requireUser], getMicrosoftChannelsByTeamIdHandler)
    app.get('/api/microsoft/teams/:teamsId/channels/:channelId', [requireUser], getTeamsChannelByIdHandler);
    app.get('/api/microsoft/teams/:teamsId/channels/folders/create', [requireUser], createJobFilesInTeamsChannelHandler)

    // Xero Routes
    app.get('/api/xero/employees', [requireUser], getXeroEmployeesHandler);
    app.get('/api/xero/timesheets', [requireUser], getXeroTimesheetsHandler);
    app.post('/api/xero/timesheets', [requireUser], createXeroTimesheetHandler);
    app.get('/api/xero/timesheets/:timesheetId', [requireUser], getXeroTimesheetHandler)
    app.get('/api/xero/contacts', [requireUser], getXeroContactsHandler)
    app.get('/api/xero/contacts/:contactId', [requireUser], getXeroContactByIdHandler)
    app.get('/api/xero/projects', [requireUser], getXeroProjectsHandler)
    app.get('/api/xero/projects/:projectId', [requireUser], getXeroProjectByIdHandler)
    app.get('/api/xero/projects/:projectId/tasks', [requireUser], getXeroProjectTasksByIdHandler)
    app.post('/api/xero/projects/:projectId/tasks/time', [requireUser], createXeroProjectTimeEntryHandler)
    app.get('/api/xero/projects/:projectId/stats', [requireUser], getXeroProjectStatsHandler);
    app.post('/api/xero/projects', [requireUser], createXeroProjectHandler)
    app.post('/api/xero/payruns', [requireUser], createXeroTimePayRunHandler);

}

export default routes;