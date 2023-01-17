import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/sessions',
                method: 'POST',
                body: { ...credentials }
            })
        }),
        loginPin: builder.mutation({
            query: ({ employeeId, pinCode }: { employeeId: number, pinCode: number }) => ({
                url: '/sessions/kiosk',
                method: 'POST',
                body: { employeeId: employeeId, pinCode: pinCode }
            })
        })
    })
})

export const {
    useLoginMutation,
    useLoginPinMutation
} = authApiSlice;