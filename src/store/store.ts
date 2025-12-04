import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import authSlice from './slices/authSlice';
import chatViewSlice from './slices/chatViewSlice';
import wsSlice from './slices/wsSlice';

// Enable Immer's MapSet plugin to support Map and Set in Redux state
enableMapSet();

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ws: wsSlice,
    chatView: chatViewSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'ws/setStompClient', 'ws/addSubscription'],
        ignoredPaths: ['ws.stompClient', 'ws.subscriptions', 'chatView.userAvatars'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;