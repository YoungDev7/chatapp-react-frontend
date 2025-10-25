import { createSlice } from '@reduxjs/toolkit';
import type { Client } from '@stomp/stompjs';

/**
 * WebSocket slice for managing STOMP client connection state.
 * 
 * Manages:
 * - STOMP client instance for WebSocket communication
 * - Connection status tracking (connecting, connected, disconnected, error)
 * 
 * This slice is used by WebSocketHandler component to store and track
 * the WebSocket connection state across the application.
 */
export const wsSlice = createSlice({
  name: 'ws',
  initialState: {
    stompClient: null as Client | null,
    connectionStatus: 'disconnected', // 'connecting', 'connected', 'disconnected', 'error'
  },
  reducers: {
    setStompClient: (state, action) => {
        state.stompClient = action.payload;
    },
    setConnectionStatus: (state, action) => {
        state.connectionStatus = action.payload;
    },
  },
});

export const { setStompClient, setConnectionStatus } = wsSlice.actions;
export default wsSlice.reducer;