"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/users/login", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

// SIGNUP
export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/users/signup", userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Signup failed");
    }
  }
);

// GET CURRENT USER
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/users/me");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Unable to fetch user");
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/users/logout");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Logout failed");
    }
  }
);
//verify
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      // API expects { token } as payload in your original code
      const res = await axios.post("/api/users/verifyemail", { token });
      return res.data;
    } catch (err) {
      // pass backend error message or full response
      return rejectWithValue(err.response?.data || "Verification failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    verifySuccess: false, // NEW: track verify status
    verifyMessage: null,  // optional message from server
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SIGNUP
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH USER
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })

       // VERIFY EMAIL
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.verifySuccess = false;
        state.verifyMessage = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.verifySuccess = true;
        // optionally store message from server: action.payload.message
        state.verifyMessage = action.payload?.message || "Email verified";
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.verifySuccess = false;
        // action.payload may be object or string
        state.error = action.payload || "Verification failed";
      });

  },
});

export const { clearError, clearVerifyState } = authSlice.actions;
export default authSlice.reducer;
