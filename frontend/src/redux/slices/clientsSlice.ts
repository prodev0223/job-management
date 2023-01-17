import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import { Client, ClientsState, CreateClient } from '../../types/clients';
import { apiSlice } from './apiSlice';




export const initialState: ClientsState = {
    clients: {},
    selectedClient: undefined,
};

export const clientsSlice = createSlice({
    name: "clients",
    initialState: initialState,
    reducers: {
        setClient(state, action: PayloadAction<Client>) {
            const client = action.payload;
            state.selectedClient = client;
        },
        selectedClient(state, action: PayloadAction<Client>) {
            const clientId = action.payload;
            console.log('selected client id', clientId)
            state.selectedClient = action.payload;
        }
    }
})

export const { selectedClient, setClient } = clientsSlice.actions;

export default clientsSlice.reducer;

export const clientsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getClients: builder.query<Client[], void>({
            query: (id: any) => '/clients',
            keepUnusedDataFor: 5,
            providesTags: ['Client']
        }),
        getClientById: builder.query<Client, string>({
            query: (clientId: string) => `/clients/${clientId}`,
            keepUnusedDataFor: 5,
            providesTags: ['Client']
        }),
        getClientTeamsById: builder.query({
            query: (teamsId: string) => `/microsoft/teams/${teamsId}`,
            keepUnusedDataFor: 5,
        }),
        getClientXeroById: builder.query({
            query: (xeroId: string) => `/xero/contacts/${xeroId}`,
            keepUnusedDataFor: 5,
        }),
        getTeamsList: builder.query({
            query: () => `/microsoft/teams`,
            keepUnusedDataFor: 5,
        }),
        deleteClientById: builder.mutation({
            query: (clientId: string) => ({
                url: `/clients/${clientId}`,
                method: 'DELETE',
                responseHandler: (response) => response.text(),
            }),
            invalidatesTags: ['Client']
        }),
        createClientTeamInMicrosoft: builder.mutation({
            query: (name: string) => ({
                url: `/microsoft/teams`,
                method: 'POST',
                body: { name: name },
                // responseHandler: (response) => response.json(),
            })
        }),
        updateClient: builder.mutation({
            query: ({ clientId, client }: { clientId: string, client: CreateClient }) => ({
                url: `/clients/${clientId}`,
                method: 'PUT',
                body: { ...client },
            }),
            invalidatesTags: ['Client']
        }),
        createClient: builder.mutation({
            query: (client: CreateClient) => ({
                url: `/clients`,
                method: 'POST',
                body: { ...client },
                responseHandler: (response) => response.json(),
            }),
            invalidatesTags: ['Client']
        })
    })
})

export const { useGetClientsQuery, useGetClientByIdQuery, useGetClientTeamsByIdQuery, useGetClientXeroByIdQuery, useGetTeamsListQuery, useDeleteClientByIdMutation, useCreateClientMutation, useCreateClientTeamInMicrosoftMutation, useUpdateClientMutation } = clientsApiSlice;