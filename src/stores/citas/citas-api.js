import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../auth/auth-api";

export const citasApi = createApi({
  reducerPath: "citasApi",
  baseQuery: baseQueryWithReauth, //ya trae middelware para refrescar token y la api url base
  endpoints: (builder) => ({
    citas: builder.mutation({
      query: (idUser) => `/citas/${idUser}`,
    }),
  }),
});
