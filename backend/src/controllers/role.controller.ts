import { Request, Response } from 'express';
import { omit } from 'lodash';
import { CreateRoleInput, createRoleSchema, DeleteRoleInput, UpdateRoleInput } from '../schemas/role.schema';
import { createRole, deleteRole, findAndUpdateRole, findRole, findRoles } from '../services/role.service';
import { findUser } from '../services/user.service';

import logger from '../utils/logger';

export async function createRoleHandler(req: Request<{}, {}, CreateRoleInput["body"]>, res: Response) {
    try {
        const role = await createRole(req.body)
        return res.send(role)
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getRoleHandler(req: Request, res: Response) {
    try {
        if (Object.keys(req.query).length !== 0) {
            const query = req.query;
            const roles = await findRole({ ...query });
            return res.send(roles);
        } else {
            const roles = await findRole({});
            return res.send(roles)
        }
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message)
    }
}

export async function getRolesHandler(req: Request, res: Response) {
    try {
        if (Object.keys(req.query).length !== 0) {
            const query = req.query;
            const roles = await findRoles({ ...query });
            return res.send(roles);
        } else {
            const roles = await findRoles({});
            return res.send(roles)
        }
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message)
    }
}

export async function updateRoleHandler(req: Request<UpdateRoleInput["params"], UpdateRoleInput["body"], {}>, res: Response) {
    try {
        const userId = res.locals.user._id;

        const roleId = req.params.roleId;
        const update = req.body;

        const role = await findRole({ roleId });

        if (!role) {
            return res.sendStatus(404);
        }

        const user = findUser({ userId });

        // if (!user && user.roleId?._id == roleId)) {
        //     return res.sendStatus(403);
        // }

        const updatedRole = await findAndUpdateRole({ roleId }, update, { new: true });
        return res.send(updatedRole);

    } catch (e: any) {
        logger.error(e);
        return res.status(422).send(e.message);
    }
}

export async function deleteRolesHandler(req: Request<DeleteRoleInput["params"]>, res: Response) {
    try {
        const userId = res.locals.user._id;
        const roleId = req.params.roleId;

        const role = await findRole({ roleId });

        if (!role) {
            return res.sendStatus(410);
        }

        if (String(role.users.map(user => userId))) {
            return res.sendStatus(403);
        }

        await deleteRole({ roleId })

    } catch (e: any) {
        logger.error(e)
        return res.status(409).send(e.message);
    }
}