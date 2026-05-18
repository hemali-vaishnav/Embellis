import { configureStore } from '@reduxjs/toolkit';
import sendOtpReducer from '../slices/sendOtpSlice';
import verifyOtpReducer from '../slices/verifyOtpSlice';
import signupReducer from '../slices/signupSlice';


const store = configureStore(
    {
        reducer: {
            sendOtp: sendOtpReducer,
            verifyOtp: verifyOtpReducer,
            signup: signupReducer,
        }
    }
);

export default store;
