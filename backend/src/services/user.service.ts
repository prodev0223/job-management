import axios from 'axios';
import { omit } from 'lodash';
import qs from 'qs';
import logger from '../utils/logger';
import { DocumentDefinition, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import RoleModel from '../models/role.model';
import UserModel, { UserDocument } from '../models/user.model';

export async function createUser(input: DocumentDefinition<Omit<UserDocument, "createdAt" | "updatedAt" | "comparePassword" | "comparePinCode">>) {
    try {
        const user = await UserModel.create(input)
        return omit(user.toJSON(), "password");
    } catch (e: any) {
        throw new Error(e)
    }
}

export async function validatePassword({ email, password }: { email: string, password: string }) {
    const user = await UserModel.findOne({ email }).populate('roleId');

    if (!user) {
        return false;
    }

    const isValid: boolean = await user.comparePassword(password);

    if (!isValid) return false;

    return omit(user.toJSON(), ['password', 'pinCode']);
}

export async function validateUserAccount({ employeeId, pinCode }: { employeeId: number, pinCode: number }) {
    const user = await UserModel.findOne({ employeeId }).populate('roleId');

    if (!user) {
        return false;
    }

    const isValid: boolean = await user.comparePinCode(pinCode);

    if (!isValid) return false;

    return omit(user.toJSON(), ['password', 'pinCode']);
}

interface AzureTokenResult {
    code: string;
    access_token: string;
    expires_in: string;
    refresh_token: string;
    scope: string;
    id_token: string;
    state: string;
}

export async function getAzureOauthTokens({
    code,
}: {
    code: string;
}): Promise<AzureTokenResult> {
    const url = process.env.AZURE_CLIENT_AUTH_URI as string;
    const clientId = process.env.AZURE_CLIENT_ID as string;
    const clientSecret = process.env.AZURE_CLIENT_SECRET as string;
    const redirectUri = process.env.AZURE_CLIENT_REDIRECT_URI as string;

    const values = {
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
    };

    try {
        const res = await axios.post<AzureTokenResult>(
            url,
            qs.stringify(values),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        return res.data;
    } catch (error: any) {
        console.error(error.response.data.error);
        logger.error(error, 'Failed to fetch Azure Tokens')
        throw new Error(error.message);
    }
}

interface AzureUserResult {
    id: string;
    userPrincipalName: string;
    '@odata.contex': string;
    businessPhones: string | null
    displayName: string | null
    givenName: string | null
    jobTitle: string | null
    mail: string | null
    mobilePhone: string | null
    officeLocation: string | null
    preferredLanguage: string | null
    surname: string | null
}

export async function getAzureUser({ id_token, access_token }: { id_token: string, access_token: string }) {
    try {
        const res = await axios.get<AzureUserResult>('https://graph.microsoft.com/v1.0/me', {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })

        // console.log('res', res)
        return res.data;
    } catch (error: any) {

    }
}

export async function findAndUpdateUser(query: FilterQuery<UserDocument>, update: UpdateQuery<UserDocument>, options: QueryOptions) {
    try {
        const user = await UserModel.findOne(query).lean();
        if (user) {
            const { roleId } = update;

            const role = await RoleModel.findById(roleId)

            if (user.roleId !== roleId) {
                role?.users.push(user);
                role?.save();


                let oldRoleUpdate = await RoleModel.updateOne({ _id: user.roleId }, {
                    $pullAll: {
                        users: [{ _id: user._id }],
                    }
                })
            }
        }

        const updatedUser = await UserModel.findOneAndUpdate(query, update, options);
        if (!updatedUser) {
            return false
        } else {
            return omit(updatedUser.toJSON(), ['password', 'pinCode']);
        }
    } catch (e: any) {
        throw new Error(e);
    }

}

export async function findUser(query: FilterQuery<UserDocument>) {
    const user = await UserModel.findOne(query).populate('roleId', ['_id', 'name', 'createdAt', 'updatedAt']);

    if (!user) {
        return false;
    }

    return omit(user.toJSON(), ['password', 'pinCode']);
}

export async function findUsers(query: FilterQuery<UserDocument>) {
    return UserModel.find(query).lean().select(['_id', 'email', 'firstName', 'lastName', 'xero', 'assignedTask', 'roleId', 'employeeId', 'azureUser', 'createdAt', 'updatedAt', '__v']).populate('roleId', ['_id', 'name', 'createdAt', 'updatedAt']);
}

export async function deleteUser(query: FilterQuery<UserDocument>) {
    return UserModel.deleteOne(query);
}