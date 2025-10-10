import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, fetchMessages } from '../../store/slices/chatViewSlice';
import MessageContainer from './MessageContainer';

/**
 * ChatView component that displays the main chat interface.
 * 
 * This component handles:
 * - Fetching and displaying chat messages
 * - Real-time message updates via WebSocket subscription
 * - Sending new messages through STOMP client
 * - Message input and send functionality
 * 
 * The component subscribes to '/topic/messages' for real-time updates and publishes
 * messages to '/app/chat' when sending new messages.
 * 
 * @returns {React.ReactElement} Chat interface with message display and input
 */
export default function ChatView() {
  const [inputMessage, setInputMessage] = useState('');
  const { chatViewCollection } = useSelector(state => state.chatView);
  const { stompClient, connectionStatus } = useSelector(state => state.ws);
  const { user } = useSelector(state => state.auth); 
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMessages());
  }, []);

  //websocket message handling
  useEffect(() => {
    if (stompClient && connectionStatus === 'connected') {
      const subscription = stompClient.subscribe('/topic/messages', (message) => {
        const newMessage = JSON.parse(message.body);
        dispatch(addMessage(newMessage));
      });

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [stompClient, connectionStatus]);

  //SENDING MESSAGE
  function handleMessageSend() {
    if (stompClient && connectionStatus === 'connected') {
      stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify({ text: inputMessage, sender: user.name, senderUid: user.uid })
      });
      setInputMessage('');
    }
  }
  
  return (
    <Container 
      maxWidth={false}
      sx={{ 
        maxWidth: '65vw', 
        height: '90vh', 
        mt: 2.5,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ flexGrow: 1, mb: 2, height: '65vh' }}>
        <Paper 
          elevation={1} 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden' // Prevent Paper from overflowing
          }}
        >
          <MessageContainer messages={chatViewCollection[0]?.messages || []} />
        </Paper>
      </Box>
      
      <Grid container spacing={1} alignItems="center">
        <Grid sx={{width: '84%'}}>
          <TextField
            fullWidth
            variant="outlined"
            type="text"
            id="inputMessage"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#424242',
                color: 'white',
                '& fieldset': {
                  borderColor: '#666',
                },
                '&:hover fieldset': {
                  borderColor: '#888',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
              }
            }}
          />
        </Grid>
        <Grid sx={{width: 'max'}}>
          <Button
            variant="contained"
            onClick={handleMessageSend}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 'auto',
              px: 2,
              p: 2
            }}
          >
            Send
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
