import { faBars, faPaperPlane, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  IconButton,
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addMessage, fetchMessages } from '../../store/slices/chatViewSlice';
import { useLayout } from '../Layout';
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
  const { chatViewCollection } = useAppSelector(state => state.chatView);
  const { stompClient, connectionStatus } = useAppSelector(state => state.ws);
  const dispatch = useAppDispatch();
  const { toggleDrawer, isMobile } = useLayout();

  useEffect(() => {
    dispatch(fetchMessages());
  }, [dispatch]);

  //websocket message handling
  useEffect(() => {
    if (stompClient && connectionStatus === 'connected') {
      const subscription = stompClient.subscribe('/topic/messages', (message: { body: string }) => {
        const newMessage = JSON.parse(message.body);
        dispatch(addMessage(newMessage));
      });

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [stompClient, connectionStatus, dispatch]);

  //SENDING MESSAGE
  function handleMessageSend() {
    if (stompClient && connectionStatus === 'connected') {
      stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify({ text: inputMessage})
      });
      setInputMessage('');
    }
  }
  
  return (
    <Box 
      sx={{ 
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {/* Title Bar */}
      <Box
        sx={{ 
          height: '55px',
          backgroundColor: (theme) => theme.palette.custom.secondaryDark,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          px: 2,
          gap: 1.5,
          flexShrink: 0,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          zIndex: 2,
          boxShadow: '0 6px 24px -2px rgba(0,0,0,0.28)'
        }}
      >
        {isMobile && (
          <IconButton
            onClick={toggleDrawer}
            sx={{
              color: 'white',
              width: 36,
              height: 36,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <FontAwesomeIcon icon={faBars} />
          </IconButton>
        )}
        <FontAwesomeIcon icon={faUsers} size="lg" />
        <Box sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
          {chatViewCollection[0]?.title || '{chatview title}'}
        </Box>
      </Box>

      {/* Message Container */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <MessageContainer messages={chatViewCollection[0]?.messages || []} />
      </Box>
      
      {/* Input Area */}
      <Box 
        sx={{ 
          backgroundColor: (theme) => theme.palette.custom.secondaryDark,
          display: 'flex',
          gap: 1,
          p: 1,
          flexShrink: 0,
          alignItems: 'center'
        }}
      >
        <TextField
          fullWidth
          placeholder="Aa"
          variant="outlined"
          type="text"
          id="inputMessage"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleMessageSend();
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '35px',
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
              padding: '8px 14px',
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleMessageSend}
          sx={{
            height: '35px',
            minWidth: 'auto',
            px: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          
          <FontAwesomeIcon icon={faPaperPlane} />
        </Button>
      </Box>
    </Box>
  );
}
