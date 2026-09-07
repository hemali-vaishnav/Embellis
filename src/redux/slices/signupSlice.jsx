import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { baseUrl } from "../../../utils/url";
import { notifyAuthChange } from "../../commonfunction/useAuthState";
import { setAuthData } from "../../commonfunction/authStorage";

const getFirstName = (name = "") => name.trim().split(/\s+/)[0] || "";

export const signupUser = createAsyncThunk(
  "signup/signupUser",
  async ({ name, email, phone, isEmailVerified, remember = false }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${baseUrl}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          isEmailVerified,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

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

      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Signup failed");
    }
  }
);

const signupSlice = createSlice({
  name: "signup",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: "",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.token = action.payload.token || null;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      });
  },
});

export default signupSlice.reducer;
