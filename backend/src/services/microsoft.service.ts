import { Client } from '@microsoft/microsoft-graph-client'
import * as msal from "@azure/msal-node"
import axios from 'axios';
require('dotenv').config();

const clientId = process.env.AZURE_CLIENT_ID as string;
const authority = process.env.AZURE_CLIENT_TENANCY_URI as string;
const clientSecret = process.env.AZURE_CLIENT_SECRET as string;

const authConfig = {
    auth: {
        clientId: clientId,
        authority: authority,
        clientSecret: clientSecret,
    }
}

export async function getClientCredentialsToken(cca: msal.ConfidentialClientApplication, clientCredentialRequestScopes?: any, ro?: any) {
    const clientCredentialRequest = {
        scopes: ["https://graph.microsoft.com/.default"],
        azureRegion: ro ? ro.region : null,
        skipCache: true,
    }

    return cca.acquireTokenByClientCredential(clientCredentialRequest).then((response: any) => {
        return response;

    }).catch((error: any) => {
        throw new Error(error);
    })
}

export async function authenticateMicrosoft(scopes?: any) {
    try {
        if (scopes) {
            const pca = new msal.ConfidentialClientApplication(authConfig);

            let auth = await getClientCredentialsToken(pca, scopes)

            return auth;
        } else {
            const pca = new msal.ConfidentialClientApplication(authConfig);

            let auth = await getClientCredentialsToken(pca)

            return auth;
        }
    } catch (e: any) {
        console.log('error', JSON.stringify(e));
        throw new Error(e);
    }
}

export async function getMicrosoftTeamsById(id: string) {
    try {

        const token = await authenticateMicrosoft();

        if (!token) {
            throw new Error('No Token Provided!');
        }

        const options = {
            headers: {
                Authorization: `Bearer ${token.accessToken}`,
            }
        }

        const response = await axios.get(`https://graph.microsoft.com/v1.0/teams/${id}`, options);

        return response.data;

    } catch (e: any) {
        console.log('error', e);
        throw new Error(e);
    }
}

export async function getMicrosoftChannelsByTeamId(teamsId: string) {
    try {
        const token = await authenticateMicrosoft();

        if (!token) {
            throw new Error('No Token Issued!');
        }

        // return token;

        const options = {
            headers: {
                Authorization: `Bearer ${token.accessToken}`,
            }
        }

        const response = await axios.get(`https://graph.microsoft.com/v1.0/teams/${teamsId}/channels`, options)

        return response.data;
    } catch (e: any) {
        console.log('error', e);
        throw new Error(e);
    }
}

export async function getProjectFilesByTeamsId(teamsId: string, channelId: string) {
    try {
        const token = await authenticateMicrosoft();

        if (!token) {
            throw new Error('No Token Issued!');
        }

        const options = {
            headers: {
                Authorization: `Bearer ${token.accessToken}`,
            }
        }

        const response = await axios.get(`https://graph.microsoft.com/v1.0/teams/${teamsId}/channels/${channelId}/filesFolder`, options)

        return response.data;
    } catch (e: any) {
        console.log('error', e);
        throw new Error(e);
    }
}

export async function createJobFilesInTeamsChannel(teamsId: string, stage: string, jobNumber: string) {
    try {
        const token = await authenticateMicrosoft();

        if (!token) {
            throw new Error('No Token Issued!');
        }

        const channels = await getMicrosoftChannelsByTeamId(teamsId);

        if (!channels) {
            throw new Error('No channels found!');
        }

        console.log('jobNumber', jobNumber);

        console.log('channels', channels?.value)

        let channel = channels.value.find((channel: { displayName: string | string[]; }) => channel.displayName.includes(jobNumber))

        if (!channel) {
            throw new Error('No channel found for the project!');
        }

        let channelFolders = await getProjectFilesByTeamsId(teamsId, channel.id);

        if (!channelFolders) {
            throw new Error('No channel folders found for the channel ID: ' + channel.id)
        }

        // return channelFolders;

        console.log('Drive ID found: ', channelFolders.parentReference.driveId);

        if (stage.toLowerCase() === 'new') {

            console.log('creating new stage folders');

            let coasteelQuote = await createTeamsFolder(token.accessToken, channelFolders.parentReference?.driveId, channelFolders.id, 'Coasteel Quote');
            let correspondence = await createTeamsFolder(token.accessToken, channelFolders.parentReference?.driveId, channelFolders.id, 'Correspondence');
            let detailingAndDrawings = await createTeamsFolder(token.accessToken, channelFolders.parentReference?.driveId, channelFolders.id, 'Detailing & Drawings');
            let supplierQuotes = await createTeamsFolder(token.accessToken, channelFolders.parentReference?.driveId, channelFolders.id, 'Supplier Quotes');

            console.log('coasteelQuotes', coasteelQuote);
            console.log('correspondence', correspondence);
            console.log('detailingAndDrawings', detailingAndDrawings);
            console.log('supplierQuotes', supplierQuotes);

            if (detailingAndDrawings) {
                let architectual = await createTeamsFolder(token.accessToken, detailingAndDrawings.parentReference?.driveId, detailingAndDrawings.id, 'Architectual')
                let detailersDrawings = await createTeamsFolder(token.accessToken, detailingAndDrawings.parentReference?.driveId, detailingAndDrawings.id, 'Detailers Drawings')
                let structural = await createTeamsFolder(token.accessToken, detailingAndDrawings.parentReference?.driveId, detailingAndDrawings.id, 'Structural')

            }

            let newChannelFolders = await getProjectFilesByTeamsId(teamsId, channel.id);
            return newChannelFolders;

        }

        if (stage.toLowerCase() === 'approved') {
            console.log('creating approved stage folders');

            let contract = await createTeamsFolder(token.accessToken, channelFolders.parentReference?.driveId, channelFolders.id, 'Contract');
            let finalInspectionReports = await createTeamsFolder(token.accessToken, channelFolders.parentReference?.driveId, channelFolders.id, 'Final Inspection Reports');
            let miscellaneous = await createTeamsFolder(token.accessToken, channelFolders.parentReference?.driveId, channelFolders.id, 'Miscellaneous');
            let paymentClaimsAndSchedules = await createTeamsFolder(token.accessToken, channelFolders.parentReference?.driveId, channelFolders.id, 'Payment Claims & Schedules');
            let photos = await createTeamsFolder(token.accessToken, channelFolders.parentReference?.driveId, channelFolders.id, 'Photos');
            let testCertificates = await createTeamsFolder(token.accessToken, channelFolders.parentReference?.driveId, channelFolders.id, 'Test Certificates');
            let whs = await createTeamsFolder(token.accessToken, channelFolders.parentReference?.driveId, channelFolders.id, 'WH&S');
            let workshopProduction = await createTeamsFolder(token.accessToken, channelFolders.parentReference?.driveId, channelFolders.id, 'Workshop Production');

            console.log('contract', contract);
            console.log('finalInspectionReports', finalInspectionReports);
            console.log('miscellaneous', miscellaneous);
            console.log('paymentClaimsAndSchedules', paymentClaimsAndSchedules);
            console.log('photos', photos);
            console.log('testCertificates', testCertificates);
            console.log('whs', whs);
            console.log('workshopProduction', workshopProduction);

            if (paymentClaimsAndSchedules) {
                let paymentClaims = await createTeamsFolder(token.accessToken, paymentClaimsAndSchedules.parentReference?.driveId, paymentClaimsAndSchedules.id, 'Payment Claims');
                let paymentSchedules = await createTeamsFolder(token.accessToken, paymentClaimsAndSchedules.parentReference?.driveId, paymentClaimsAndSchedules.id, 'Payment Schedules');
                let variations = await createTeamsFolder(token.accessToken, paymentClaimsAndSchedules.parentReference?.driveId, paymentClaimsAndSchedules.id, 'Variations');
            }

            let approvedChannelFolders = await getProjectFilesByTeamsId(teamsId, channel.id);
            return approvedChannelFolders;
        }

    } catch (e: any) {
        console.log('error', e);
        throw new Error(e);
    }
}

export async function createMicrosoftTeam(name: string) {
    try {

        const token = await authenticateMicrosoft();

        if (!token) {
            throw new Error('No Token Issues!');

        }

        const options = {
            headers: {
                Authorization: `Bearer ${token.accessToken}`,
                'Content-Type': 'application/json',
            }
        }

        const users = await axios.get('https://graph.microsoft.com/v1.0/users', options);

        let usersToAdd: any[] = [];

        users.data.value.map((user: any) => {
            if (user.mail !== null && user.mail.includes('coasteelengineering.com.au')) {
                if (user.userPrincipalName.includes('jen')) {
                    usersToAdd.push({
                        '@odata.type': '#microsoft.graph.aadUserConversationMember',
                        roles: [
                            'owner'
                        ],
                        'user@odata.bind': `https://graph.microsoft.com/v1.0/users(\'${user.id}\')`
                    });
                }
            }
        })

        const team = {
            'template@odata.bind': 'https://graph.microsoft.com/v1.0/teamsTemplates(\'standard\')',
            displayName: `Client - ${name}`,
            description: `Client Team Channel for ${name}`,
            members: usersToAdd
        };

        await axios.post('https://graph.microsoft.com/v1.0/teams', { ...team }, options).then((response) => {
            console.log('response teams creation', response);
            return response.data;
        }, (error) => {
            throw new Error(error);
        });

        // console.log('response teams creation', data);
        // console.log('response teams creation verbose', data);

        // if (!data) {
        //     throw new Error('Microsoft timeout, try again!');
        // }

        // return data;

    } catch (e: any) {
        console.log('error', e);
        throw new Error(e);
    }
}



export async function createMicrosoftTeamChannel(teamsId: string, jobNumber: string, jobDescription: string) {
    try {
        const token = await authenticateMicrosoft();

        if (!token) {
            throw new Error('No token found!');
        }

        const options = {
            headers: {
                Authorization: `Bearer ${token.accessToken}`,
                'Content-Type': 'application/json',
            }
        }

        const channel = {
            displayName: `Project - ${jobNumber}`,
            description: `${jobDescription}`,
        }

        console.log('channel', channel);

        const response = await axios.post(
            `https://graph.microsoft.com/v1.0/teams/${teamsId}/channels`,
            JSON.stringify(channel),
            options
        )

        return response.data;
    } catch (e: any) {
        console.log('error', e);
        throw new Error(e);
    }
}

export async function getAllTeamsList() {
    try {
        const token = await authenticateMicrosoft();

        if (!token) {
            throw new Error('No Token Issued!');
        }

        const options = {
            headers: {
                Authorization: `Bearer ${token.accessToken}`,
            }
        }

        const response = await axios.get(`https://graph.microsoft.com/v1.0/groups?$filter=resourceProvisioningOptions/Any(x:x eq 'Team')`, options);

        if (!response.data) {
            throw new Error('No Response found!');
        }

        return response.data;
    } catch (e: any) {
        console.log('error', e);
        throw new Error(e);
    }
}

export async function createTeamsFolder(accessToken: any, driveId: string, channelId?: string, name?: string) {
    try {
        const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        }

        const folderCreated = await axios.post(`https://graph.microsoft.com/v1.0/drives/${driveId}/items/${channelId ? channelId : 'root'}/children`, {
            name: name,
            folder: {},
            "@microsoft.graph.conflictBehavior": "replace",
        }, options);

        return folderCreated.data;

    } catch (e: any) {
        console.log('error', e);
        throw new Error(e);
    }
}