import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/Api';

type Message = {
  text: string;
  senderName: string;
  createdAt?: string | number; // ISO 8601 string or Unix timestamp in seconds (optional for old messages)
}

// type ChatView = {
//   viewId: number;
//   title: string;
//   isLoading: boolean;
//   messages: Message[];
//   error: string | null;
// }

/**
 * Async thunk to fetch messages from the API.
 * Currently fetches all messages but is designed to support fetching messages for specific chat views.
 * 
 * @async
 * @function fetchMessages
 * @param {*} _ - Unused parameter (placeholder for future chatViewID parameter)
 * @param {Object} thunkAPI - Redux Toolkit thunk API object
 * @param {Function} thunkAPI.rejectWithValue - Function to return rejected value on error
 * @returns {Promise<Array>} Promise that resolves to array of message objects
 * @throws {Object} Returns rejected value with error data or message
 */
export const fetchMessages = createAsyncThunk(
    'chatView/fetchMessages',
  async (chatViewId: string = '1', { rejectWithValue }) => {
    try {
      const response = await api.get(`/chatviews/${chatViewId}/messages`);
      return response.data;
      // return { 
      //   viewId: chatViewID, 
      //   messages: response.data 
      // };
    } catch (error: unknown) {
      console.error('Error fetching messages:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const responseData = (error && typeof error === 'object' && 'response' in error) 
        ? (error as { response?: { data?: unknown } }).response?.data 
        : undefined;
      return rejectWithValue(responseData || errorMessage);
    }
  }
);

// Unused for now, left for future use
/*
const _fetchChatViews = createAsyncThunk(
  'chatView/fetchChatViews',
  async () => {
    try {
      const response = await api.get('/chatViews');
      if(response.status === 200) {
        return response.data;
      }
    }catch (error) {
      console.error("error fetching chatViews:", error)
    }
  }
)
*/

/**
 * Redux slice for managing chat view state.
 * Handles a collection of chat views, each containing messages, loading state, and error state.
 * Currently operates primarily on the first chat view (index 0) but is structured to support multiple views.
 * 
 * @namespace chatViewSlice
 */
const chatViewSlice = createSlice({
    name: 'chatView',
    initialState: {
        chatViewCollection: [{
            viewId: 1,
            title: 'global',
            isLoading: false,
            messages: [] as Message[],
            error: null as string | null
        }], 
    },
    reducers: {
        setMessages: (state, action) => {
            state.chatViewCollection[0].messages = action.payload;
            // const { viewId, messages } = action.payload;
            // const view = state.chatViewCollection.find(view => view.viewId === viewId);
            // if(view){
            //   view.messages = messages;
            // }
        },
        addMessage: (state, action) => {
            state.chatViewCollection[0].messages.push(action.payload);
            // const { viewId, message } = action.payload;
            // const view = state.chatViews.find(view => view.viewId === viewId);
            // if(view){
            //   view.messages.push(message);
            // }
        },
        addChatView: (state, action) => {
          state.chatViewCollection.push({ 
            viewId: action.payload.viewId, 
            title: action.payload.title,
            isLoading: false,
            messages: [],
            error: null
          });
        }
    },
    extraReducers: (builder) => {
      builder 
         .addCase(fetchMessages.pending, (state) => {
            state.chatViewCollection[0].isLoading = true;
            // const chatViewID = action.meta.arg;
            // const view = state.chatViewCollection.find(view => view.viewId === chatViewID);
            // if (view) {
            //   view.isLoading = true;
            // }
          })
          .addCase(fetchMessages.fulfilled, (state, action) => {
            state.chatViewCollection[0].messages = action.payload;
            state.chatViewCollection[0].isLoading = false;
            // const { viewId, messages } = action.payload;
            // const view = state.chatViewCollection.find(view => view.viewId === viewId);
            // if (view) {
            //   view.isLoading = false;
            //   view.messages = messages;
            // }
          })
          .addCase(fetchMessages.rejected, (state, action) => {
            state.chatViewCollection[0].isLoading = false;
            state.chatViewCollection[0].error = action.error.message || 'Failed to fetch messages';
            // const chatViewID = action.meta.arg;
            // const view = state.chatViewCollection.find(view => view.viewId === chatViewID);
            // if (view) {
            //   view.isLoading = false;
            //   view.error = action.payload;
            // }
          });
    }
});

export const { setMessages, addMessage, addChatView } = chatViewSlice.actions;
export default chatViewSlice.reducer;