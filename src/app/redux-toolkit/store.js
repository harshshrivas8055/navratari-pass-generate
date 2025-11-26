"use client";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import adminReducer from "./adminSlice";
import userReducer from "./userSlice";
import eventReducer from "./eventSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    user: userReducer,
    events: eventReducer,
  },
});
