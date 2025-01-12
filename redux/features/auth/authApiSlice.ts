import { apiSlice } from '../../services/apiSlice';

interface User {
    first_name: string;
    last_name: string;
    email: string;
}

interface LoginResponse {
    access: string;
    refresh: string;
}

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        retrieveUser: builder.query<User, void>({
            query: () => '/users/me/',
        }),
        login: builder.mutation<LoginResponse, { email: string; password: string }>({
            query: ({ email, password }) => ({
                url: '/users/jwt/create/',
                method: 'POST',
                body: { email, password },
            }),
        }),
        verify: builder.mutation({
            query: ({ token }) => ({
                url: '/users/jwt/verify/',
                method: 'POST',
                body: { token }, // Sending the access token to verify
            }),
        }),
        refresh: builder.mutation({
            query: ({ refresh }) => ({
                url: '/users/jwt/refresh/',
                method: 'POST',
                body: { refresh }, // Sending the refresh token to get a new access token
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/users/jwt/logout/',
                method: 'POST',
            }),
        }),
        resetPassword: builder.mutation({
            query: (email) => ({
                url: '/users/reset_password/',
                method: 'POST',
                body: { email },
            }),
        }),
        resetPasswordConfirm: builder.mutation({
            query: ({ uid, token, new_password, re_new_password }) => ({
                url: '/users/reset_password_confirm/',
                method: 'POST',
                body: { uid, token, new_password, re_new_password },
            }),
        }),
        retrieveProfile: builder.query({
            query: ({ }) => ({
                url: '/users/profile/',
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useRetrieveUserQuery,
    useLoginMutation,
    useVerifyMutation,
    useRefreshMutation,
    useLogoutMutation,
    useResetPasswordMutation,
    useResetPasswordConfirmMutation,
    useRetrieveProfileQuery,
} = authApiSlice;
