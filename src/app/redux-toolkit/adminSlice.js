"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// FETCH ALL USERS (ADMIN)
export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/admin/users");
      return res.data.users;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load users");
    }
  }
);

// DELETE USER
export const deleteuser = createAsyncThunk(
  "admin/deleteuser",
  async (UserId, { rejectWithValue, dispatch }) => {
    try {
      await axios.delete(`/api/admin/users`, { data: { id: UserId } });
      dispatch(fetchAllUsers()); // Refresh user list after deletion
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete user");
    }
  }
);

// TOGGLE PAYMENT
export const togglePaymentStatus = createAsyncThunk(
  "admin/togglePaymentStatus",
  async ({ id, status }, { rejectWithValue, dispatch }) => {
    try {
      await axios.post("/api/admin/payment", {
        userId: id,
        paymentStatus: !status,
      });

      dispatch(fetchAllUsers());
    } catch (err) {
      return rejectWithValue(err.response?.data || "Error updating payment");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(togglePaymentStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(togglePaymentStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(togglePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteuser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteuser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteuser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
