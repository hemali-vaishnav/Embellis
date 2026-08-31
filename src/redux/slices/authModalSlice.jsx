import { createSlice } from "@reduxjs/toolkit";

const authModalSlice = createSlice({
  name: "authModal",
  initialState: {
    step: null, // null | "verify-phone" | "signup"
  },
  reducers: {
    openAuthModal: (state) => {
      state.step = "verify-phone";
    },
    setAuthStep: (state, action) => {
      state.step = action.payload;
    },
    closeAuthModal: (state) => {
      state.step = null;
    },
  },
});

export const { openAuthModal, setAuthStep, closeAuthModal } = authModalSlice.actions;
export default authModalSlice.reducer;
