import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Role, RolesState } from '../../types/roles';
import { apiSlice } from './apiSlice';


export const initialState: RolesState = {
    roles: {},
}

export const rolesSlicer = createSlice({
    name: "roles",
    initialState: initialState,
    reducers: {
        receivedRoles(state, action: PayloadAction<Role[]>) {
            const roles = action.payload;
            roles.forEach(role => {
                state.roles[role._id] = role;
            })
        }
    }
})

export const { receivedRoles } = rolesSlicer.actions;

export default rolesSlicer.reducer;

export const rolesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getRoles: builder.query<Role[], void>({
            query: () => `/roles`,
            keepUnusedDataFor: 5,
        })
    })
})

export const { useGetRolesQuery } = rolesApiSlice;