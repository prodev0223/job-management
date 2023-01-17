import { Request, Response } from 'express';
import { omit } from 'lodash';
import mongoose from 'mongoose'
import { CreateClientInput, DeleteClientInput, UpdateClientInput } from '../schemas/client.schema';
import { createClient, deleteClient, findAndUpdateClient, findClient, findClients } from '../services/client.service';
import logger from '../utils/logger';

export async function createClientHandler(req: Request<{}, {}, CreateClientInput["body"]>, res: Response) {
    try {

        const client = await createClient(req.body);
        return res.send(client)
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function updateClientHandler(req: Request<UpdateClientInput["params"], UpdateClientInput["body"]>, res: Response) {
    try {
        // const userId = res.locals.user._id;
        // const requestedUserId = req.params.userId;
        const clientId = req.params.clientId;
        const update = req.body;

        const client = await findClient(clientId);

        if (!client) {
            return res.sendStatus(404);
        }

        // TODO:  Ensure admin/appropriate rank can remove/update a client
        // if (String(client._id) !== clientId) {
        //     return res.sendStatus(403);
        // }

        const updatedClient = await findAndUpdateClient({ _id: clientId }, update, { new: true })
        return res.send(updatedClient);

    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getClientsHandler(req: Request, res: Response) {
    try {
        if (Object.keys(req.query).length !== 0) {
            const query = req.query
            const clients = await findClients(query)
            return res.send(clients);
        } else {
            const clients = await findClients({})
            return res.send(clients);
        }
    } catch (e: any) {
        logger.error(e)
        return res.status(409).send(e.message);
    }
}

export async function getClientHandler(req: Request, res: Response) {
    try {
        //const userId = res.locals.user._id;
        const clientId = req.params.clientId;
        console.log('clientId', clientId);

        const client = await findClient(clientId)
        return res.send(client);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function deleteClientHandler(req: Request<DeleteClientInput["params"]>, res: Response) {
    const clientId = req.params.clientId;

    const client = await findClient(clientId);

    if (!client) {
        return res.sendStatus(410);
    }

    // TODO: Check if user is admin

    await findAndUpdateClient({ _id: clientId }, { isActive: false }, { new: true });

    return res.sendStatus(200);
}