import { get } from "lodash"
import config from 'config';
import { reIssueAccessToken } from "../services/session.service";
import { verifyJwt } from "../utils/jwt.utils";
import { Request, Response, NextFunction, CookieOptions } from 'express';

const accessTokenCookieOptions: CookieOptions = {
    maxAge: config.get('accessTokenCookieTtl'),
    httpOnly: true,
    // domain: config.get('domain'),
    path: '/',
    sameSite: 'none',
    secure: config.get('isProduction')
};

const deserialiseUser = async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "")
    const refreshToken = get(req, "headers.x-refresh");

    if (!accessToken) {
        return next();
    }

    const { decoded, expired } = verifyJwt(accessToken, "accessTokenPublicKey")

    if (decoded) {
        res.locals.user = decoded
        return next();
    }

    if (expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken({ refreshToken });

        if (newAccessToken) {
            res.setHeader('x-access-token', newAccessToken);
            res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 })
        }

        const result = verifyJwt(newAccessToken as string, "accessTokenPublicKey");

        res.locals.user = result.decoded;

        return next();

    }

    return next();
}

export default deserialiseUser;