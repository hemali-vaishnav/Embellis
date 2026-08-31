import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../../utils/url";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchAllCustomOrders = createAsyncThunk(
  "adminCustom/fetchAllCustomOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/admin/custom`, {
        headers: authHeaders(),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch custom orders");

      return data.custom || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch custom orders");
    }
  }
);

const adminCustomSlice = createSlice({
  name: "adminCustom",
  initialState: {
    orders: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomOrders.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchAllCustomOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllCustomOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch custom orders";
      });
  },
});

export default adminCustomSlice.reducer;
