import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../../utils/url";
import { getAuthItem } from "../../commonfunction/authStorage";

const authHeaders = () => {
  const token = getAuthItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchAllCarts = createAsyncThunk(
  "adminCartFavorites/fetchAllCarts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/admin/carts`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch carts");
      return data.items || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch carts");
    }
  }
);

export const fetchAllFavorites = createAsyncThunk(
  "adminCartFavorites/fetchAllFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/admin/favorites`, { headers: authHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch favorites");
      return data.favorites || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch favorites");
    }
  }
);

const adminCartFavoritesSlice = createSlice({
  name: "adminCartFavorites",
  initialState: {
    carts: [],
    cartsLoading: false,
    cartsError: "",
    favorites: [],
    favoritesLoading: false,
    favoritesError: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCarts.pending, (state) => {
        state.cartsLoading = true;
        state.cartsError = "";
      })
      .addCase(fetchAllCarts.fulfilled, (state, action) => {
        state.cartsLoading = false;
        state.carts = action.payload;
      })
      .addCase(fetchAllCarts.rejected, (state, action) => {
        state.cartsLoading = false;
        state.cartsError = action.payload || "Failed to fetch carts";
      })
      .addCase(fetchAllFavorites.pending, (state) => {
        state.favoritesLoading = true;
        state.favoritesError = "";
      })
      .addCase(fetchAllFavorites.fulfilled, (state, action) => {
        state.favoritesLoading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchAllFavorites.rejected, (state, action) => {
        state.favoritesLoading = false;
        state.favoritesError = action.payload || "Failed to fetch favorites";
      });
  },
});

export default adminCartFavoritesSlice.reducer;
