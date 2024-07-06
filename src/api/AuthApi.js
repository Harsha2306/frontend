import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_IS_PROD === "YES"
        ? import.meta.env.VITE_BACKEND_URL
        : import.meta.env.VITE_LOCALHOST_BACKEND_URL,
  }),
  endpoints: (builder) => ({
    postRegister: builder.mutation({
      query: ({ firstName, lastName, email, password }) => ({
        url: "/register",
        method: "post",
        body: { firstName, lastName, email, password },
      }),
    }),
    postLogin: builder.mutation({
      query: ({ email, password }) => ({
        url: "/login",
        method: "post",
        body: { email, password },
      }),
    }),
  }),
});

export const { usePostRegisterMutation, usePostLoginMutation } = authApi;
