import { createSlice } from "@reduxjs/toolkit";

const AUTH_INITIAL_STATE = {
  status: "not-authenticate",
  user: null,
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: AUTH_INITIAL_STATE,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, user } = action.payload;
      if (accessToken) {
        state.accessToken = accessToken;
      }
      state.user = user || null;
      state.status = "authenticate";
    },
    setToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setLogout: (state) => {
      state.user = AUTH_INITIAL_STATE.user;
      state.accessToken = AUTH_INITIAL_STATE.accessToken;
      state.status = AUTH_INITIAL_STATE.status;
    },
    setPendingAuth: (state) => {
      state.status = "pending";
    },
  },
});

export const { setCredentials, setLogout, setPendingAuth, setToken } =
  authSlice.actions;
