import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../../utils/url";

export const fetchTrending = createAsyncThunk(
  "featured/fetchTrending",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/products/featured?flag=trending&limit=${limit}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch trending products");
      return data.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch trending products");
    }
  }
);

export const fetchBestSellers = createAsyncThunk(
  "featured/fetchBestSellers",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/products/featured?flag=best_seller&limit=${limit}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch best sellers");
      return data.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch best sellers");
    }
  }
);

const featuredSlice = createSlice({
  name: "featured",
  initialState: {
    trending: [],
    trendingLoading: false,
    trendingError: "",
    bestSellers: [],
    bestSellersLoading: false,
    bestSellersError: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => {
        state.trendingLoading = true;
        state.trendingError = "";
      })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trendingLoading = false;
        state.trending = action.payload;
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.trendingLoading = false;
        state.trendingError = action.payload || "Failed to fetch trending products";
      })
      .addCase(fetchBestSellers.pending, (state) => {
        state.bestSellersLoading = true;
        state.bestSellersError = "";
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        state.bestSellersLoading = false;
        state.bestSellers = action.payload;
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        state.bestSellersLoading = false;
        state.bestSellersError = action.payload || "Failed to fetch best sellers";
      });
  },
});

export default featuredSlice.reducer;
