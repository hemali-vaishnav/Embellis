import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../../utils/url";
import { getAuthItem } from "../../commonfunction/authStorage";

const authHeaders = (json = true) => {
  const token = getAuthItem("token");
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

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/users/cart`, { headers: authHeaders(false) });
      const data = await handleResponse(res);
      return data.items || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity = 1, size }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/users/cart`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ productId, quantity, size }),
      });
      const data = await handleResponse(res);
      return data.items || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to add to cart");
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/users/cart/${itemId}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ quantity }),
      });
      const data = await handleResponse(res);
      return data.items || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update cart item");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/users/cart/${itemId}`, {
        method: "DELETE",
        headers: authHeaders(false),
      });
      const data = await handleResponse(res);
      return data.items || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to remove cart item");
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/users/cart`, {
        method: "DELETE",
        headers: authHeaders(false),
      });
      const data = await handleResponse(res);
      return data.items || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to clear cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: "",
  },
  reducers: {
    resetCart: (state) => {
      state.items = [];
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addMatcher(
        (action) =>
          [
            fetchCart.fulfilled.type,
            addToCart.fulfilled.type,
            updateCartItem.fulfilled.type,
            removeFromCart.fulfilled.type,
            clearCart.fulfilled.type,
          ].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addMatcher(
        (action) =>
          [
            fetchCart.rejected.type,
            addToCart.rejected.type,
            updateCartItem.rejected.type,
            removeFromCart.rejected.type,
            clearCart.rejected.type,
          ].includes(action.type),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || "Cart action failed";
        }
      );
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
