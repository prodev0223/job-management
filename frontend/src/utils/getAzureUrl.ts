function getAzureOAuthURL() {
    const rootUri = process.env.REACT_APP_AZURE_ENDPOINT as string;
    const redirectUri = process.env.REACT_APP_AZURE_REDIRECT_URI as string;
    const clientId = process.env.REACT_APP_AZURE_CLIENT_ID as string;
    const scope = process.env.REACT_APP_AZURE_SCOPE as string;
    console.log('rootURL', rootUri);
    console.log('redirectUri', redirectUri);
    console.log('clientId', clientId);
    console.log('scope', scope);

    const options = {
        client_id: clientId,
        response_type: 'code',
        redirect_uri: redirectUri,
        scope: 'openid profile',
        response_mode: 'query',
        state: "12314",
        nonce: '678910',
    }

    //     client_id = 6731de76 - 14a6 - 49ae - 97bc - 6eba6914391e
    //     response_type=id_token
    //     redirect_uri=http % 3A % 2F % 2Flocalhost % 2Fmyapp % 2F
    //     scope=openid
    //     response_mode=fragment
    //     state=12345
    //     nonce=678910

    const qs = new URLSearchParams(options)

    console.log(`${rootUri}?${qs.toString()}`)

    return `${rootUri}?${qs.toString()}`;
}


export default getAzureOAuthURL



