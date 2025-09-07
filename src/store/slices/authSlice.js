/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Buffer } from 'buffer';
import api from '../../services/Api';

/**
 * Async thunk to validate the current authentication token.
 * 
 * Checks if a token exists in localStorage and validates it with the server.
 * Used during app initialization to verify existing authentication state.
 * 
 * @returns {Promise} Promise resolving to validation result or rejection with error
 */
export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      if (!localStorage.getItem('accessToken')) {
        throw new Error("no token found in localstorage");
      }
      
      const response = await api.get('/auth/validateToken');
      return response.data;

    } catch (error) {
      console.error("Error validating token", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * Async thunk to handle user logout.
 * 
 * Sends logout request to server and clears authentication state.
 * Ensures cleanup even if server request fails.
 * 
 * @returns {Promise} Promise that always clears auth state regardless of server response
 */
export const handleLogout = createAsyncThunk(
  'auth/handleLogout',
  async(_, {dispatch} ) =>{
    
    try{
      await api.post('/auth/logout');
      dispatch(clearAuth());
    }catch(error){
      console.error("logout error: " + error);
      dispatch(clearAuth());
    }
}
);

const parseJWT = (token) => {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64'));
    return {
      email: payload.sub,
      name: payload.name,
      uid: payload.uid
    };
  } catch (error) {
    throw new Error("Error parsing JWT token ", error);
  }
};


const updateUserFromToken = (state, token) => {
  if (token) {
    try {
      state.user = parseJWT(token);
    } catch (error) {
      console.error(error);
      state.user = { email: null, name: null, uid: null };
    }
  } else {
    state.user = { email: null, name: null, uid: null };
  }
};

const clearAuthState = (state) => {
  console.debug("reached");
  state.token = null;
  state.user = { email: null, name: null, uid: null };
  state.isValidating = false;
  localStorage.removeItem('accessToken');
};

/**
 * Authentication slice for managing user authentication state.
 * 
 * Manages:
 * - JWT access token storage and persistence
 * - User data extracted from JWT tokens
 * - Token validation and refresh logic
 * - Login/logout state management
 * - Authentication loading states
 * 
 * Features:
 * - Automatic token validation on app load
 * - localStorage persistence for tokens
 * - JWT parsing for user information extraction
 * - Logout with server notification
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('accessToken'),
    user: {
      email: null,
      name: null,
      uid: null
    },
    isValidating: true,
  },
  reducers: {
    setToken: (state, action) => {
      const newToken = action.payload;
      state.token = newToken;
      
      if (newToken) {
        localStorage.setItem('accessToken', newToken);
      } else {
        localStorage.removeItem('accessToken');
      }
    },
    clearAuth: (state) => {
      clearAuthState(state);
    },
    setValidating: (state, action) => {
      state.isValidating = action.payload;
    },
    setUser: (state, action) => {
      const token = action.payload;
      updateUserFromToken(state, token);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateToken.pending, (state) => {
        state.isValidating = true;
      })
      .addCase(validateToken.fulfilled, (state) => {
        state.isValidating = false;
        updateUserFromToken(state, state.token);
      })
      .addCase(validateToken.rejected, (state, action) => {
        clearAuthState(state);
      })
  }
});

export const { setToken, setUser, clearAuth, setValidating } = authSlice.actions;
export default authSlice.reducer;