import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
//admin add
export const createEvent = createAsyncThunk(
  "events/createEvent",
  async (eventData, thunkAPI) => {
    try {
      const res = await axios.post("/api/admin/eventss", eventData);
      return res.data.event;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Error");
    }
  }
);

//user and admin view
export const fetchEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get("/api/users/eventss");
      return res.data.events;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to fetch events");
    }
  }
);

const eventSlice = createSlice({
  name: "events",
  initialState: { events: [], loading: false, error: null, success: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.success = "Event created successfully";
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default eventSlice.reducer;
