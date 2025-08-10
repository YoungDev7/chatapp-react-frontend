import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/Api';


export const fetchMessages = createAsyncThunk(
    'chatView/fetchMessages',
  async (/*chatViewID*/) => {
    try {
      const response = await api.get('/messages');
      if (response.status === 200) {
        return response.data;
        // return { 
        //   viewId: chatViewID, 
        //   messages: response.data 
        // };
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }
);

const fetchChatViews = createAsyncThunk(
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

const chatViewSlice = createSlice({
    name: 'chatView',
    initialState: {
        chatViewCollection: [{
            viewId: 1,
            title: 'general',
            isLoading: false,
            messages: [],
            error: null
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
          state.chatViewCollection.push({ viewId: action.payload.viewId, title: action.payload.title });
        }
    },
    extraReducers: (builder) => {
      builder 
         .addCase(fetchMessages.pending, (state, action) => {
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
            state.chatViewCollection[0].error = action.error.message;
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