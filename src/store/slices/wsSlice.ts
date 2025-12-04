import { createSlice } from '@reduxjs/toolkit';
import type { Client, StompSubscription } from '@stomp/stompjs';
import { clearAuth } from './authSlice';

/**
 * WebSocket slice for managing STOMP client connection state.
 * 
 * Manages:
 * - STOMP client instance for WebSocket communication
 * - Connection status tracking (connecting, connected, disconnected, error)
 * - Active subscriptions Map to track all chat view subscriptions
 * 
 * This slice is used by WebSocketHandler component to store and track
 * the WebSocket connection state across the application.
 */
const initialState = {
  stompClient: null as Client | null,
  connectionStatus: 'disconnected' as 'connecting' | 'connected' | 'disconnected' | 'error',
  subscriptions: new Map<string, StompSubscription>(),
};

export const wsSlice = createSlice({
  name: 'ws',
  initialState,
  reducers: {
    setStompClient: (state, action) => {
        state.stompClient = action.payload;
    },
    setConnectionStatus: (state, action) => {
        state.connectionStatus = action.payload;
    },
    addSubscription: (state, action) => {
        const { viewId, subscription } = action.payload;
        state.subscriptions.set(viewId, subscription);
    },
    removeSubscription: (state, action) => {
        const viewId = action.payload;
        state.subscriptions.delete(viewId);
    },
    clearAllSubscriptions: (state) => {
        state.subscriptions.forEach(sub => {
          if (sub && typeof sub.unsubscribe === 'function') {
            sub.unsubscribe();
          }
        });
        state.subscriptions.clear();
    },
  },
  extraReducers: (builder) => {
    builder
      // Clear WebSocket state on logout
      .addCase(clearAuth, (state) => {
        // Unsubscribe from all active subscriptions before clearing
        state.subscriptions.forEach(sub => {
          if (sub && typeof sub.unsubscribe === 'function') {
            sub.unsubscribe();
          }
        });
        // Disconnect the STOMP client if connected
        if (state.stompClient && state.stompClient.connected) {
          state.stompClient.deactivate();
        }
        return initialState;
      });
  },
});

export const { setStompClient, setConnectionStatus, addSubscription, removeSubscription, clearAllSubscriptions } = wsSlice.actions;
export default wsSlice.reducer;