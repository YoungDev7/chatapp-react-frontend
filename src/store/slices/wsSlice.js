import { createSlice } from '@reduxjs/toolkit';


export const wsSlice = createSlice({
  name: 'ws',
  initialState: {
    stompClient: null,
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

export const { stompClient, connectionStatus, setStompClient, setConnectionStatus } = wsSlice.actions;
export default wsSlice.reducer;