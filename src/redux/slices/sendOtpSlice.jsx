import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../../utils/url";

export const sendOtp = createAsyncThunk(
  "sendOtp/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/users/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to send OTP");

      return { ...data, email };
    } catch (err) {
      return rejectWithValue(err.message || "Failed to send OTP");
    }
  }
);

const sendOtpSlice = createSlice({
  name: "sendOtp",
  initialState: {
    email: "",
    otpSent: false,
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpSent = true;
        state.email = action.payload.email;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send OTP";
      });
  },
});

export default sendOtpSlice.reducer;
