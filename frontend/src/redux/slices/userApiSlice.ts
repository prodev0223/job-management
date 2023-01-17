import { number, string } from "yup";
import { Role } from "../../types/roles";
import { User, XeroUser } from "../../types/user";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => '/users',
            keepUnusedDataFor: 5
        }),
        getUserById: builder.query<User, string>({
            query: (userId: string) => `/users/${userId}`,
            keepUnusedDataFor: 5,
        }),
        getUsersFromXero: builder.query<XeroUser[], void>({
            query: () => `/xero/employees`,
            keepUnusedDataFor: 5,
        }),
        updateUserDetails: builder.mutation({
            query: ({
                userId,
                email,
                firstName,
                lastName,
                employeeId,
                roleId,
                xeroEmpID,
                pincode
            }: {
                userId: string,
                email: string,
                firstName: string,
                lastName: string,
                employeeId: number,
                roleId: string,
                xeroEmpID: string,
                pincode?: number;
            }) => ({
                url: `/users/${userId}`,
                method: 'PUT',
                body: {
                    email,
                    firstName,
                    lastName,
                    employeeId,
                    roleId,
                    xero: {
                        employeeId: xeroEmpID,
                    },
                    pincode
                }
            })
        }),
        createUser: builder.mutation({
            query: ({
                email,
                firstName,
                lastName,
                employeeId,
                roleId,
                xeroEmpID,
                xeroEarningRate,
                pincode,
                password,
                passwordConfirmation
            }: {
                email: string,
                firstName: string,
                lastName: string,
                employeeId: number,
                roleId: string,
                xeroEmpID: string,
                xeroEarningRate: string,
                password: string,
                passwordConfirmation: string,
                pincode?: number
            }) => ({
                url: `/users`,
                method: 'POST',
                body: {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    employeeId: employeeId,
                    roleId: roleId,
                    xero: {
                        employeeId: xeroEmpID,
                        earningsRateId: xeroEarningRate
                    },
                    pinCode: pincode,
                    password: password,
                    passwordConfirmation: passwordConfirmation
                }
            })
        })
    })
})

export const { useGetUsersQuery, useGetUserByIdQuery, useGetUsersFromXeroQuery, useUpdateUserDetailsMutation, useCreateUserMutation } = userApiSlice;