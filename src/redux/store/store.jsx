import { configureStore } from '@reduxjs/toolkit';
import sendOtpReducer from '../slices/sendOtpSlice';
import verifyOtpReducer from '../slices/verifyOtpSlice';
import signupReducer from '../slices/signupSlice';
import catalogReducer from '../slices/catalogSlice';
import productReducer from '../slices/productSlice';
import cartReducer from '../slices/cartSlice';
import favoriteReducer from '../slices/favoriteSlice';
import adminUserReducer from '../slices/adminUserSlice';
import adminCustomReducer from '../slices/adminCustomSlice';
import adminCartFavoritesReducer from '../slices/adminCartFavoritesSlice';
import authModalReducer from '../slices/authModalSlice';
import featuredReducer from '../slices/featuredSlice';
import customOrderReducer from '../slices/customOrderSlice';


const store = configureStore(
    {
        reducer: {
            sendOtp: sendOtpReducer,
            verifyOtp: verifyOtpReducer,
            signup: signupReducer,
            catalog: catalogReducer,
            products: productReducer,
            cart: cartReducer,
            favorites: favoriteReducer,
            adminUsers: adminUserReducer,
            adminCustom: adminCustomReducer,
            adminCartFavorites: adminCartFavoritesReducer,
            authModal: authModalReducer,
            featured: featuredReducer,
            customOrder: customOrderReducer,
        }
    }
);

export default store;
