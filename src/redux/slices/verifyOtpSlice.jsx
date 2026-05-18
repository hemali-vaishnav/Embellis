import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../../utils/url";

const getFirstName = (name = "") => name.trim().split(/\s+/)[0] || "";

export const verifyOtp = createAsyncThunk(
  "verifyOtp/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user?.name) {
        localStorage.setItem("user", getFirstName(data.user.name));
      }

      if (data.user?.email) {
        localStorage.setItem("email", data.user.email);
      }

      if (data.user?.role) {
        localStorage.setItem("role", data.user.role);
      }
      
      if (data.user?.phone) {
        localStorage.setItem("phone", data.user.phone);
      }

      return { ...data, email: data.user?.email || email };
    } catch (err) {
      return rejectWithValue(err.message || "Invalid OTP");
    }
  }
);

const verifyOtpSlice = createSlice({
  name: "verifyOtp",
  initialState: {
    user: null,
    token: null,
    email: "",
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
        state.email = action.payload.email || "";
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Invalid OTP";
      });
  },
});

export default verifyOtpSlice.reducer;
