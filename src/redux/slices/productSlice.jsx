import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../../utils/url";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const { category, subCategory } =
        typeof params === "string" ? { category: params } : params || {};

      const query = new URLSearchParams();
      if (category) query.set("category", category);
      if (subCategory) query.set("sub_category", subCategory);
      const queryString = query.toString();

      const res = await fetch(`${baseUrl}/products${queryString ? `?${queryString}` : ""}`);

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch products");

      return data.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch products");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/products/${id}`);

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch product");

      return data.data;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch product");
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    categories: [],
    loading: false,
    error: "",
    selectedProduct: null,
    selectedLoading: false,
    selectedError: "",
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.selectedError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })
      .addCase(fetchProductById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = "";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload || "Failed to fetch product";
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;

export default productSlice.reducer;
