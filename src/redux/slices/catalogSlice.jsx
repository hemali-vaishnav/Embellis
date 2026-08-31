import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../../utils/url";

const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const uploadCatalog = createAsyncThunk(
  "catalog/uploadCatalog",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${baseUrl}/admin/upload-catalog`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");

      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Upload failed");
    }
  }
);

export const fetchCatalog = createAsyncThunk(
  "catalog/fetchCatalog",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/admin/get-catalog`, {
        headers: authHeaders(),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch catalog");

      return data.data || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to fetch catalog");
    }
  }
);

const catalogSlice = createSlice({
  name: "catalog",
  initialState: {
    categories: [],
    loading: false,
    error: "",
    uploading: false,
    uploadError: "",
    uploadResult: null,
  },
  reducers: {
    clearUploadResult: (state) => {
      state.uploadResult = null;
      state.uploadError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadCatalog.pending, (state) => {
        state.uploading = true;
        state.uploadError = "";
        state.uploadResult = null;
      })
      .addCase(uploadCatalog.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadResult = action.payload;
      })
      .addCase(uploadCatalog.rejected, (state, action) => {
        state.uploading = false;
        state.uploadError = action.payload || "Upload failed";
      })
      .addCase(fetchCatalog.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch catalog";
      });
  },
});

export const { clearUploadResult } = catalogSlice.actions;
export default catalogSlice.reducer;
