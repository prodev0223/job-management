import { CookieOptions, Request, Response } from 'express';
import config from 'config';
import { findAndUpdateUser, findUser, getAzureOauthTokens, getAzureUser, validatePassword, validateUserAccount } from '../services/user.service';
import { createSession, findSessions, updateSession } from '../services/session.service';
import { signJWT } from '../utils/jwt.utils';
import { getOriginDetails } from '../utils/ipapi';
import logger from '../utils/logger';
import { faker } from '@faker-js/faker';
import { findRole } from '../services/role.service';
require('dotenv').config;

const originURI = process.env.FRONTEND_URI;


const accessTokenCookieOptions: CookieOptions = {
    maxAge: config.get('accessTokenCookieTtl'),
    httpOnly: true,
    // domain: config.get('domain'),
    path: '/',
    sameSite: 'none',
    secure: config.get('isProduction')
};

const refreshTokenCookieOptions: CookieOptions = {
    ...accessTokenCookieOptions,
    maxAge: config.get('refreshTokenCookieTtl')
}


export async function createUserSessionHandler(req: Request, res: Response) {

    try {
        // Validate the user's password
        const user = await validatePassword(req.body);

        if (!user) {
            return res.status(401).send('Invalid email or password');
        }

        // Gather IP Related details

        // let ip = req.socket.remoteAddress || "";

        // console.log('ip', ip.split(':'));

        // const origin = await getOriginDetails(ip === '::1' ? ip : ip.split(':')[3]);

        // console.log('origin details', origin);


        // Create a session

        // const session = await createSession(user._id, req.get('user-agent') || "", origin?.data?.ip, origin?.data?.city, origin?.data?.region, origin?.data?.country_name, origin?.data?.timezone, origin?.data?.org, origin?.data?.asn, origin?.data?.latitude, origin?.data?.longitude);
        const session = await createSession(user._id, req.get('user-agent') || "");

        // Create an access token

        const accessToken = signJWT(
            {
                ...user, session: session._id,
            },
            "accessTokenPrivateKey",
            {
                expiresIn: config.get('accessTokenTtl') // 15 minutes
            }
        )

        // Create a refresh token

        const refreshToken = signJWT(
            {
                ...user,
                session: session._id,
            },
            "refreshTokenPrivateKey",
            {
                expiresIn: config.get('refreshTokenTtl') // 15 minutes
            }
        )

        // Return access & refresh token


        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 })

        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 })

        return res.send({ accessToken, refreshToken });
    } catch (e: any) {
        return res.send(e.message);
    }
}

export async function createProdUserSessionHandler(req: Request, res: Response) {

    try {



        const { employeeId, pinCode } = req.body;


        // Validate the user's pincode
        const user = await validateUserAccount(req.body);

        if (!user) {
            return res.status(401).send('Invalid employeeID or pincode');
        }

        // Gather IP Related details

        // let ip = req.socket.remoteAddress || "";

        // console.log('ip', ip.split(':'));

        // const origin = await getOriginDetails(ip === '::1' ? ip : ip.split(':')[3]);

        // console.log('origin details', origin);


        // Create a session


        // const session = await createSession(user._id, req.get('user-agent') || "", origin?.data?.ip, origin?.data?.city, origin?.data?.region, origin?.data?.country_name, origin?.data?.timezone, origin?.data?.org, origin?.data?.asn, origin?.data?.latitude, origin?.data?.longitude);
        const session = await createSession(user._id, req.get('user-agent') || "");
        // Create an access token

        const accessToken = signJWT(
            {
                ...user, session: session._id,
            },
            "accessTokenPrivateKey",
            {
                expiresIn: config.get('accessTokenTtl') // 15 minutes
            }
        )

        // Create a refresh token

        const refreshToken = signJWT(
            {
                ...user,
                session: session._id,
            },
            "refreshTokenPrivateKey",
            {
                expiresIn: config.get('refreshTokenTtl') // 15 minutes
            }
        )

        // Return access & refresh token

        // res.cookie("accessToken", accessToken, accessTokenCookieOptions)

        // res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions)

        res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 })

        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 })

        return res.send({ accessToken, refreshToken });
    } catch (e: any) {
        return res.send(e.message);
    }
}

export async function azureOAuthHandler(req: Request, res: Response) {
    // get the code from qs
    const code = req.query.code as string;

    try {
        console.log('ms query header', req.query)
        console.log('ms params header', req.params)
        console.log('ms body', req.body)

        const { id_token, access_token } = await getAzureOauthTokens({ code });

        if (!id_token && !access_token) {

            let message = encodeURIComponent('Auth invalid')
            return res.redirect(`${originURI}/?error=${message}`)
        }

        const azureUser = await getAzureUser({ id_token, access_token })

        if (!azureUser) {
            let message = encodeURIComponent('User details invalid')
            return res.redirect(`${originURI}/?error=${message}`)

        }

        let empId = faker.random.numeric(4)
        let fakePassword = faker.random.alphaNumeric(24)
        let fakePincode = faker.random.numeric(6);

        const role = await findRole({ name: 'Unassigned' });

        if (!role) {
            let message = encodeURIComponent('Role not found!')
            return res.redirect(`${originURI}/?error=${message}`)
        }

        console.log('role', role);

        let user = await findUser({ email: azureUser.userPrincipalName })

        if (!user) {
            // upsert the user
            const updateUser = await findAndUpdateUser(
                {
                    email: azureUser.userPrincipalName
                },
                {
                    email: azureUser.userPrincipalName,
                    firstName: azureUser.givenName,
                    lastName: azureUser.surname,
                    employeeId: empId,
                    roleId: role._id,
                    pinCode: fakePincode,
                    azureUser: true
                },
                {
                    upsert: true,
                    new: true,
                }
            )

            console.log('updateUser', updateUser)

            if (!updateUser) {

                let message = encodeURIComponent('User not inserted into the DB')
                return res.redirect(`${originURI}/?error=${message}`)
            }

            const fullUser = await findUser({ _id: updateUser._id })

            if (!fullUser) {
                let message = encodeURIComponent('User not found')
                return res.redirect(`${originURI}/?error=${message}`)
            }

            const session = await createSession(fullUser._id, req.get("user-agent") || "");

            // create an access token

            // Create an access token

            const accessToken = signJWT(
                {
                    ...fullUser, session: session._id,
                },
                "accessTokenPrivateKey",
                {
                    expiresIn: config.get('accessTokenTtl') // 15 minutes
                }
            )

            // Create a refresh token

            const refreshToken = signJWT(
                {
                    ...fullUser,
                    session: session._id,
                },
                "refreshTokenPrivateKey",
                {
                    expiresIn: config.get('refreshTokenTtl') // 15 minutes
                }
            )

            // Return access & refresh token

            // res.cookie("accessToken", accessToken, accessTokenCookieOptions)

            // res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions)

            res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 })

            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 })

            // res.send({
            //     accessToken,
            //     refreshToken
            // })
            return res.redirect(`${originURI}/#/login?accessToken=${accessToken}&refreshToken=${refreshToken}`)

        } else {
            // upsert the user
            const updateUser = await findAndUpdateUser(
                {
                    email: azureUser.userPrincipalName
                },
                {
                    email: azureUser.userPrincipalName,
                    firstName: azureUser.givenName,
                    lastName: azureUser.surname,
                    // employeeId: empId,
                    // roleId: role._id,
                    // pinCode: fakePincode,
                },
                {
                    upsert: true,
                    new: true,
                }
            )

            console.log('updateUser', updateUser)

            if (!updateUser) {

                let message = encodeURIComponent('User not inserted into the DB')
                return res.redirect(`${originURI}/?error=${message}`)
            }

            const fullUser = await findUser({ _id: updateUser._id })

            if (!fullUser) {
                let message = encodeURIComponent('User not found')
                return res.redirect(`${originURI}/?error=${message}`)
            }

            const session = await createSession(fullUser._id, req.get("user-agent") || "");

            // create an access token

            // Create an access token

            const accessToken = signJWT(
                {
                    ...fullUser, session: session._id,
                },
                "accessTokenPrivateKey",
                {
                    expiresIn: config.get('accessTokenTtl') // 15 minutes
                }
            )

            // Create a refresh token

            const refreshToken = signJWT(
                {
                    ...fullUser,
                    session: session._id,
                },
                "refreshTokenPrivateKey",
                {
                    expiresIn: config.get('refreshTokenTtl') // 15 minutes
                }
            )

            // Return access & refresh token

            // res.cookie("accessToken", accessToken, accessTokenCookieOptions)

            // res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions)

            res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 })

            res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 24 * 60 * 60 * 1000 })

            // res.send({
            //     accessToken,
            //     refreshToken
            // })
            return res.redirect(`${originURI}/#/login?accessToken=${accessToken}&refreshToken=${refreshToken}`)

        }
    } catch (error) {
        logger.error(error, 'Failed to authorize Azure User');
        //return res.send(JSON.stringify(error))
        let message = encodeURIComponent('Failed to authorize user!')
        return res.redirect(`${originURI}/?error=${message}`)
    }
}

export async function getUserSessionsHandler(req: Request, res: Response) {
    const userId = res.locals.user._id;

    const sessions = await findSessions({ user: userId, valid: true })

    return res.send(sessions);
}

export async function deleteSessionHandler(req: Request, res: Response) {
    const sessionId = res.locals.user.session;

    await updateSession({ _id: sessionId }, { valid: false })

    return res.send({
        accessToken: null,
        refreshToken: null
    })
}