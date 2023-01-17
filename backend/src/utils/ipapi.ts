import axios from 'axios';

export type GetIpApiResponse = {
    ip: string;
    version: string;
    city: string;
    region: string;
    region_code: string;
    country_code: string;
    country_name: string;
    timezone: string;
    org: string;
    asn: string;
    latitude: string;
    longitude: string;
}

export const getOriginDetails = async (ip: string) => {
    const { data, status } = await axios.get<GetIpApiResponse>(
        `https://ipapi.co/${ip}/json`,
        {
            headers: {
                Accept: 'application/json',
                'Retry-After': 30
            },
        },
    );

    if (status !== 200) {
        throw new Error('Status not 200');
    }

    return { data, status }
}
