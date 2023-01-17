import { BaseQueryApi, BaseQueryFn } from '@reduxjs/toolkit/dist/query/baseQueryTypes';
import { createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { REHYDRATE } from 'redux-persist';
import { setCredentials, logout } from '../../redux/slices/authSlice';
import { RootState } from '../store';

export interface SerializedError {
    name?: string
    message?: string
    stack?: string
    code?: string
}
interface CustomFetchQueryError {
    error: object;
    meta: object;
}

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_BASE_URI,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const accessToken = (getState() as RootState).auth.accessToken;
        const refreshToken = (getState() as RootState).auth.refreshToken;
        if (accessToken && refreshToken) {
            headers.set('Authorization', `Bearer ${accessToken}`)
            headers.set('x-refresh', refreshToken)
        }
        return headers;
    }
})
const baseQueryWithReAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError | SerializedError> = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
    let result = await baseQuery(args, api, extraOptions);
    console.log('result', result);
    console.log('data', result && result.data);

    if (result?.error && result.error.data === 'Forbidden') {
        console.log('sending refresh token');
        // send refresh token to get a new access token
        const refreshResult = await baseQuery('/me', api, extraOptions);
        console.log(refreshResult);

        if (refreshResult?.data) {
            const user = (api.getState() as RootState).auth.user;
            // store the new token
            api.dispatch(setCredentials({ ...(typeof refreshResult.data === 'object' ? refreshResult.data : {}), user }))
            // retry the original query with new access token
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logout());
        }
    }

    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReAuth,
    tagTypes: ['Client'],
    // extractRehydrationInfo(action, { reducerPath }) {
    //     if (action.type === REHYDRATE) {
    //         return action.payload[reducerPath]
    //     }
    // },
    endpoints: builder => ({})
})

