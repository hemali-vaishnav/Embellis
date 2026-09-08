import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../../utils/url";
import { getAuthItem } from "../../commonfunction/authStorage";

const authHeaders = () => {
  const token = getAuthItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const submitCustomOrder = createAsyncThunk(
  "customOrder/submitCustomOrder",
  async ({ file, type, size, color, printPlacement, quantity, price, note }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);
      formData.append("size", size);
      formData.append("color", color);
      formData.append("print_placement", printPlacement);
      formData.append("quantity", quantity);
      formData.append("price", price);
      if (note) formData.append("note", note);

      const res = await fetch(`${baseUrl}/users/custom`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit custom order");

      return data.custom;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to submit custom order");
    }
  }
);

const customOrderSlice = createSlice({
  name: "customOrder",
  initialState: {
    submitting: false,
    submitError: "",
    submitResult: null,
  },
  reducers: {
    clearCustomOrderResult: (state) => {
      state.submitResult = null;
      state.submitError = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitCustomOrder.pending, (state) => {
        state.submitting = true;
        state.submitError = "";
      })
      .addCase(submitCustomOrder.fulfilled, (state, action) => {
        state.submitting = false;
        state.submitResult = action.payload;
      })
      .addCase(submitCustomOrder.rejected, (state, action) => {
        state.submitting = false;
        state.submitError = action.payload || "Failed to submit custom order";
      });
  },
});

export const { clearCustomOrderResult } = customOrderSlice.actions;
export default customOrderSlice.reducer;
