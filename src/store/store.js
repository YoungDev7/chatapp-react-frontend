import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import wsSlice from './slices/wsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ws: wsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});