import { Request, Response } from 'express';
import { omit } from 'lodash';
import { CreateUserInput, UpdateUserInput } from '../schemas/user.schema';
import { findRole } from '../services/role.service';
import { createUser, findAndUpdateUser, findUser, findUsers } from '../services/user.service';
import logger from '../utils/logger';

export async function createUserHandler(req: Request<{}, {}, CreateUserInput["body"]>, res: Response) {
    try {
        console.log('req body', req.body);
        const user = await createUser(req.body);
        return res.send(omit(user, 'password'))
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getCurrentUserHandler(req: Request, res: Response) {
    try {
        return res.send(res.locals.user);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function updateUserHandler(req: Request<UpdateUserInput["params"]>, res: Response) {
    try {
        const userId = res.locals.user._id;
        const requestedUserId = req.params.userId;
        const update = req.body;

        const user = await findUser({ _id: requestedUserId });

        let requestedByPrivillege = await findUser({ _id: userId })

        if (!user) {
            return res.sendStatus(404);
        }

        if (!requestedByPrivillege) {
            return res.sendStatus(422);
        }

        console.log('requestedBy', requestedByPrivillege.roleId._id)

        const adminRole = await findRole({ name: 'Super Admin' });


        if (!adminRole) {
            return res.sendStatus(403);
        }

        console.log('adminRole', adminRole._id);

        if (String(user._id) === userId) {
            console.log('not user!')
            const updatedUser = await findAndUpdateUser({ _id: requestedUserId }, update, { new: true })
            return res.send(updatedUser);
            // return res.sendStatus(403);
        } else {
            if (String(requestedByPrivillege.roleId._id) !== String(adminRole._id)) {
                console.log('not privilleged!')
                return res.sendStatus(403);
            } else {
                const updatedUser = await findAndUpdateUser({ _id: requestedUserId }, update, { new: true })
                return res.send(updatedUser);
            }
        }


    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getUsersHandler(req: Request, res: Response) {
    try {
        if (Object.keys(req.query).length !== 0) {
            const query = req.query
            const users = await findUsers(query)
            return res.send(users);
        } else {
            const users = await findUsers({})
            return res.send(users);
        }
    } catch (e: any) {
        logger.error(e)
        return res.status(409).send(e.message);
    }
}

export async function getUserHandler(req: Request, res: Response) {
    try {
        const userId = res.locals.user._id;
        const requestedUserId = req.params.userId;

        const user = await findUser({ _id: requestedUserId })
        return res.send(user);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}