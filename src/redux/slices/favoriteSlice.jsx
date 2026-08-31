import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../../utils/url";

const authHeaders = (json = true) => {
  const token = localStorage.getItem("token");
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

export const fetchFavorites = createAsyncThunk(
  "favorites/fetchFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/users/favorites`, { headers: authHeaders(false) });
      const data = await handleResponse(res);
      return data.favorites || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch favorites");
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  "favorites/toggleFavorite",
  async (productId, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetch(`${baseUrl}/users/favorites/${productId}`, {
        method: "POST",
        headers: authHeaders(false),
      });
      const data = await handleResponse(res);
      dispatch(fetchFavorites());
      return { productId, liked: data.liked };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update favorite");
    }
  }
);

const favoriteSlice = createSlice({
  name: "favorites",
  initialState: {
    favorites: [],
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch favorites";
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.error = action.payload || "Failed to update favorite";
      });
  },
});

export default favoriteSlice.reducer;
