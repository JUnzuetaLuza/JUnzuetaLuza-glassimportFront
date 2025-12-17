import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./auth/auth-api";
import { authSlice } from "./auth/auth-slice";

export default configureStore({
  reducer: {
    auth: authSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware]),
});
