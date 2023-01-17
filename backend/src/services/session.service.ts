import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
import { signJWT, verifyJwt } from "../utils/jwt.utils";
import { findUser } from "./user.service";
import config from 'config';
import { get } from "lodash";


export async function createSession(userId: string, userAgent: string, ipAddress?: string, city?: string, region?: string, countryName?: string, timezone?: string, ipOrg?: string, ipAS?: string, latitude?: string, longitude?: string) {
    const session = await SessionModel.create({
        user: userId,
        userAgent,
        ipAddress,
        city,
        region,
        countryName,
        timezone,
        ipOrg,
        ipAS,
        latitude,
        longitude
    })

    return session.toJSON();
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
    return SessionModel.find(query).lean().populate('user', 'email firstName lastName pinCode roleId createdAt updatedAt');
}

export async function updateSession(query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {
    return SessionModel.updateOne(query, update);
}

export async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
    const { decoded } = verifyJwt(refreshToken, 'refreshTokenPublicKey');

    if (!decoded || !get(decoded, 'session')) return false;

    const session = await SessionModel.findById(get(decoded, 'session'));

    if (!session || !session.valid) return false;

    const user = await findUser({ _id: session.user })

    if (!user) return false

    const accessToken = signJWT(
        {
            ...user, session: session._id,
        },
        "accessTokenPrivateKey",
        {
            expiresIn: config.get<string>('accessTokenTtl')
        }
    )

    return accessToken;
}