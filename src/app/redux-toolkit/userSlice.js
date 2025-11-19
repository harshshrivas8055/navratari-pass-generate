"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// FETCH PROFILE USER
export const loadProfile = createAsyncThunk(
  "user/loadProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/users/me");
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to load profile");
    }
  }
);

// UPDATE PROFILE
export const saveProfile = createAsyncThunk(
  "user/saveProfile",
  async ({ location, paymentStatus }, { rejectWithValue, dispatch }) => {
    try {
      await axios.post("/api/users/update", { location, paymentStatus });

      dispatch(loadProfile());
    } catch (err) {
      return rejectWithValue(err.response?.data || "Update failed");
    }
  }
);

// UPLOAD IMAGE
export const uploadImage = createAsyncThunk(
  "user/uploadImage",
  async (file, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(loadProfile());
    } catch (err) {
      return rejectWithValue(err.response?.data || "Image upload failed");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
