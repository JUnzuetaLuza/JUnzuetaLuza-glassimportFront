import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setLogout, setPendingAuth, setToken } from "./auth-slice";

const API_BASE_URL = import.meta.env.VITE_API;

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: API_BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      console.log({ state: getState() });
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // Si el backend responde con 401, intentamos refrescar el token
  if (result.error && result.error.status === 401) {
    api.dispatch(setPendingAuth());

    const refreshToken = await baseQuery(
      { url: "/auth/refresh-token", method: "GET" },
      api,
      extraOptions
    );

    console.log(refreshToken);

    if (refreshToken.data) {
      const newAccessToken = refreshToken.data.accessToken;
      api.dispatch(setToken(newAccessToken));

      result = await baseQuery(args, api, extraOptions);
    } else {
      // Si falla la renovación, cerrar sesión
      console.log("Logout");

      await baseQuery(
        {
          url: "/auth/logout",
          method: "POST",
          credentials: "include",
        },
        api,
        extraOptions
      );

      api.dispatch(setLogout());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  //baseQuery: baseQueryWithReauth,
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
