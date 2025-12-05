import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/Api';
import type { ChatView } from '../../types/chatView';
import { clearAuth } from './authSlice';


type ChatViewState = {
  chatViewCollection: ChatView[],
  isLoadingChatViews: boolean,
  currentlyDisplayedChatView: string,
  userAvatars: Map<string, string>,
  error: string | null
}

const initialState: ChatViewState = {
  chatViewCollection: [], 
  isLoadingChatViews: true,
  currentlyDisplayedChatView: "1",
  userAvatars: new Map<string, string>(),
  error: null
};

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
export const fetchAllMessages = createAsyncThunk(
    'chatView/fetchAllMessages',
  async (chatViewId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chatviews/${chatViewId}/messages`);
      
      return { 
        chatViewId: chatViewId, 
        messages: response.data 
      };
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

export const fetchMessagesFromQueue = createAsyncThunk(
  'chatView/fetchMessagesFromQueue',
  async (chatViewId: string, { rejectWithValue }) => {
    try{
      const response = await api.get(`/chatviews/${chatViewId}/messages/queue`);

      return {
        chatViewId: chatViewId,
        messages: response.data
      }
    }catch(error: unknown) {
      console.error('Error fetching messages:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const responseData = (error && typeof error === 'object' && 'response' in error) 
        ? (error as { response?: { data?: unknown } }).response?.data 
        : undefined;
      return rejectWithValue(responseData || errorMessage);
    }
  }
);

export const fetchChatViews = createAsyncThunk(
  'chatView/fetchChatViews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/chatviews');
      return response.data;
    }catch(error: unknown) {
      console.error('Error fetching messages:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const responseData = (error && typeof error === 'object' && 'response' in error) 
        ? (error as { response?: { data?: unknown } }).response?.data 
        : undefined;
      return rejectWithValue(responseData || errorMessage);
    }
  }
)


/**
 * Redux slice for managing chat view state.
 * Handles a collection of chat views, each containing messages, loading state, and error state.
 * Currently operates primarily on the first chat view (index 0) but is structured to support multiple views.
 * 
 * @namespace chatViewSlice
 */
const chatViewSlice = createSlice({
    name: 'chatView',
    initialState,
    reducers: {
        setIsLoadingChatViews: (state, action) => {
            state.isLoadingChatViews = action.payload;
        },
        setCurrentlyDisplayedChatView: (state, action) => {
          state.currentlyDisplayedChatView = action.payload;
        },
        setMessages: (state, action) => {
          const { viewId, messages } = action.payload;
          const view = state.chatViewCollection.find(view => view.viewId === viewId);
          if(view){
            view.messages = messages;
            localStorage.setItem(`messages_${viewId}`, JSON.stringify(messages));
          }
        },
        addMessage: (state, action) => {
          const { viewId, message } = action.payload;
          const view = state.chatViewCollection.find(view => view.viewId === viewId);
            if(view){
              if (!view.messages) {
                view.messages = [];
              }
              view.messages.push(message);
              localStorage.setItem(`messages_${viewId}`, JSON.stringify(view.messages));
            }
        },
        addChatView: (state, action) => {
          state.chatViewCollection.push({ 
            viewId: action.payload.viewId, 
            title: action.payload.title,
            isLoading: false,
            messages: action.payload.messages,
            error: null
          });
        },
        addUserAvatars: (state, action) => {
          const userAvatarsObj = action.payload;
          Object.entries(userAvatarsObj).forEach(([userId, avatarUrl]) => {
            state.userAvatars.set(userId, avatarUrl as string);
          });          
        }
    },
    extraReducers: (builder) => {
      builder 
      // fetchAllMessages
         .addCase(fetchAllMessages.pending, (state, action) => {
            const chatViewId = action.meta.arg;
            const view = state.chatViewCollection.find(view => view.viewId === chatViewId);
            if (view) {
              view.isLoading = true;
            }
          })
          .addCase(fetchAllMessages.fulfilled, (state, action) => {
            const { chatViewId, messages } = action.payload;
            const view = state.chatViewCollection.find(view => view.viewId === chatViewId);
            if (view) {
              view.isLoading = false;
              view.messages = messages;
              localStorage.setItem(`messages_${chatViewId}`, JSON.stringify(messages));
            }
          })
          .addCase(fetchAllMessages.rejected, (state, action) => {
            const chatViewId = action.meta.arg;
            const view = state.chatViewCollection.find(view => view.viewId === chatViewId);
            if (view) {
              view.isLoading = false;
              view.error = action.error.message || 'Failed to fetch messages';
            }
          })
      // fetchMessagesFromQueue
          .addCase(fetchMessagesFromQueue.pending, (state, action) => {
            const chatViewId = action.meta.arg;
            const view = state.chatViewCollection.find(view => view.viewId === chatViewId);
            if (view) {
              view.isLoading = true;
            }
          })
          .addCase(fetchMessagesFromQueue.fulfilled, (state, action) => {
            const { chatViewId, messages } = action.payload;
            const view = state.chatViewCollection.find(view => view.viewId === chatViewId);
            if (view) {
              view.isLoading = false;
              const localStorageMessages = JSON.parse(localStorage.getItem(`messages_${chatViewId}`) || '[]');
              const updatedMessages = [...localStorageMessages, ...messages];
              view.messages = updatedMessages;
              localStorage.setItem(`messages_${chatViewId}`, JSON.stringify(updatedMessages));
            }
          })
          .addCase(fetchMessagesFromQueue.rejected, (state, action) => {
            const chatViewId = action.meta.arg;
            const view = state.chatViewCollection.find(view => view.viewId === chatViewId);
            if (view) {
              view.isLoading = false;
              view.error = action.error.message || 'Failed to fetch messages';
            }
          })
      // fetchChatViews
          .addCase(fetchChatViews.fulfilled, (state) => {
            state.error = null
          })
          .addCase(fetchChatViews.rejected, (state, action) => {
            state.error = action.error.message || 'Failed to fetch messages';
          })
      // Clear chatView state on logout
          .addCase(clearAuth, () => {
            return initialState;
          });
    }
});

export const { setIsLoadingChatViews, setCurrentlyDisplayedChatView, setMessages, addMessage, addChatView, addUserAvatars } = chatViewSlice.actions;

export const selectUserAvatar = (state: { chatView: ChatViewState }, userId: string): string | undefined => {
  return state.chatView.userAvatars.get(userId);
};

export const selectAllUserAvatars = (state: { chatView: ChatViewState }): Array<[string, string]> => {
  return Array.from(state.chatView.userAvatars.entries());
};

export default chatViewSlice.reducer;