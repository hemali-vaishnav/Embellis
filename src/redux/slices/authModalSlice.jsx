import { createSlice } from "@reduxjs/toolkit";

const authModalSlice = createSlice({
  name: "authModal",
  initialState: {
    step: null, // null | "verify-phone" | "signup"
    rememberMe: false,
  },
  reducers: {
    openAuthModal: (state) => {
      state.step = "verify-phone";
      state.rememberMe = false;
    },
    setAuthStep: (state, action) => {
      state.step = action.payload;
    },
    setRememberMe: (state, action) => {
      state.rememberMe = action.payload;
    },
    closeAuthModal: (state) => {
      state.step = null;
    },
  },
});

export const { openAuthModal, setAuthStep, setRememberMe, closeAuthModal } = authModalSlice.actions;
export default authModalSlice.reducer;
