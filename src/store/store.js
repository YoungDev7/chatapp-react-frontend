import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import chatViewSlice from './slices/chatViewSlice';
import wsSlice from './slices/wsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ws: wsSlice,
    chatView: chatViewSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'ws/setStompClient'],
        ignoredPaths: ['ws.stompClient'],
      },
    }),
});