import { createSlice } from '@reduxjs/toolkit';
import type { Client, StompSubscription } from '@stomp/stompjs';

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
export const wsSlice = createSlice({
  name: 'ws',
  initialState: {
    stompClient: null as Client | null,
    connectionStatus: 'disconnected', // 'connecting', 'connected', 'disconnected', 'error'
    subscriptions: new Map<string, StompSubscription>(), // Map of viewId -> subscription
  },
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
});

export const { setStompClient, setConnectionStatus, addSubscription, removeSubscription, clearAllSubscriptions } = wsSlice.actions;
export default wsSlice.reducer;