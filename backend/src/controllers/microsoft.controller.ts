import { Request, Response } from 'express';
import { createJobFilesInTeamsChannel, createMicrosoftTeam, getAllTeamsList, getMicrosoftChannelsByTeamId, getMicrosoftTeamsById, getProjectFilesByTeamsId } from '../services/microsoft.service';
import logger from '../utils/logger';


export async function getMicrosoftTeamsByIdHandler(req: Request, res: Response) {
    try {
        const { teamsId } = req.params;

        if (!teamsId) {
            return res.status(422).send('No Teams ID found!');
        }

        const result = await getMicrosoftTeamsById(teamsId);

        return res.send(result);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getMicrosoftChannelsByTeamIdHandler(req: Request, res: Response) {
    try {
        const { teamsId } = req.params;

        if (!teamsId) {
            return res.status(422).send('No Teams ID found!');
        }

        const result = await getMicrosoftChannelsByTeamId(teamsId);

        return res.send(result);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getTeamsChannelByIdHandler(req: Request, res: Response) {
    try {
        const { teamsId, channelId } = req.params;

        if (!teamsId) {
            return res.status(422).send('No Teams ID found!');
        }

        if (!channelId) {
            return res.status(422).send('No Channel ID found!');
        }

        const result = await getProjectFilesByTeamsId(teamsId, channelId);

        return res.send(result);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function createJobFilesInTeamsChannelHandler(req: Request, res: Response) {
    try {
        const { teamsId } = req.params;
        const { jobNumber, stage } = req.query;

        if (!teamsId) {
            return res.status(422).send('No Teams ID found!');
        }

        if (!jobNumber) {
            return res.status(422).send('No Project Number found!');
        }

        if (!stage) {
            return res.status(422).send('No Stage found!');
        }

        const result = await createJobFilesInTeamsChannel(teamsId, String(stage), String(jobNumber))

        return res.send(result);
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function getAllTeamsListHandler(req: Request, res: Response) {
    try {
        const result = await getAllTeamsList();

        return res.send(result)
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}

export async function createMicrosoftTeamHandler(req: Request, res: Response) {
    try {
        const result = await createMicrosoftTeam(req.body.name);

        // let final;

        console.log('result', result);

        const teamsList = await getAllTeamsList().then((response) => {
            let final = response.value.find((team: { displayName: string; }) => team.displayName === `Client - ${req.body.name}`)
            console.log('final', final);
            return res.send(final);
        }).catch((err) => {
            throw new Error(err)
        });

        // return res.send(final)
    } catch (e: any) {
        logger.error(e);
        return res.status(409).send(e.message);
    }
}