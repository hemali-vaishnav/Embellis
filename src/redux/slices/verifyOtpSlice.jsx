import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../../utils/url";
import { notifyAuthChange } from "../../commonfunction/useAuthState";
import { setAuthData } from "../../commonfunction/authStorage";

const getFirstName = (name = "") => name.trim().split(/\s+/)[0] || "";

export const verifyOtp = createAsyncThunk(
  "verifyOtp/verifyOtp",
  async ({ email, otp, remember = false }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");

      setAuthData(
        {
          token: data.token,
          user: data.user?.name ? getFirstName(data.user.name) : undefined,
          email: data.user?.email,
          role: data.user?.role,
          phone: data.user?.phone,
        },
        remember
      );

      notifyAuthChange();

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
  reducers: {
    clearVerifyOtpError: (state) => {
      state.error = "";
    },
  },
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

export const { clearVerifyOtpError } = verifyOtpSlice.actions;
export default verifyOtpSlice.reducer;
