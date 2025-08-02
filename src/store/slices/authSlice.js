/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Buffer } from 'buffer';
import api from '../../services/Api';


export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async () => {
    try {
      if (localStorage.getItem('accessToken')) {
        const response = await api.get('/auth/validateToken');
      }
    } catch (error) {
      console.error("Error validating token", error);
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
      state.token = null;
      state.user = { email: null, name: null, uid: null };
      state.isValidating = false;
      localStorage.removeItem('accessToken');
    },
    setValidating: (state, action) => {
      state.isValidating = action.payload;
    },
    setUser(state, action) {
      const token = action.payload;
      if(token) {
        try{
          state.user = parseJWT(token);
        }catch (error){
          console.error(error);
        }
      }else {
        state.user = { email: null, name: null, uid: null };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(validateToken.pending, (state) => {
        state.isValidating = true;
      })
      .addCase(validateToken.fulfilled, (state) => {
        state.isValidating = false;
        if(state.token) {
          try{
            state.user = parseJWT(state.token);
          }catch (error){
            console.error(error);
          }
        }
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.token = null;
        state.user = { email: null, name: null, uid: null };
        state.isValidating = false;
        localStorage.removeItem('accessToken');
      })
  }
});

export const { setToken, setUser, clearAuth, setValidating } = authSlice.actions;
export default authSlice.reducer;