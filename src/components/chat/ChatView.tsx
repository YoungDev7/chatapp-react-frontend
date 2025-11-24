import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addMessage, fetchMessages } from '../../store/slices/chatViewSlice';
import { useLayout } from '../Layout';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
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
  const { chatViewCollection } = useAppSelector(state => state.chatView);
  const { stompClient, connectionStatus } = useAppSelector(state => state.ws);
  const dispatch = useAppDispatch();
  const { toggleDrawer, isMobile } = useLayout();

  useEffect(() => {
    dispatch(fetchMessages('1')); // Fetch messages for global chat
  }, [dispatch]);

  //websocket message handling
  useEffect(() => {
    if (stompClient && connectionStatus === 'connected') {
      const chatViewId = '1'; // Global chat
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const subscription = stompClient.subscribe(`/topic/chatview.${chatViewId}.user.${user.uid}`, (message: { body: string }) => {
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
  function handleMessageSend(message: string) {
    if (stompClient && connectionStatus === 'connected') {
      const chatViewId = '1'; // Global chat
      stompClient.publish({
        destination: `/app/chatview/${chatViewId}`,
        body: JSON.stringify({ text: message, createdAt: new Date().toISOString() })
      });
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
      <ChatHeader 
        title={chatViewCollection[0]?.title || '{chatview title}'}
        isMobile={isMobile}
        onMenuClick={toggleDrawer}
      />

      {/* Message Container */}
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <MessageContainer messages={chatViewCollection[0]?.messages || []} />
      </Box>
      
      {/* Input Area */}
      <ChatInput 
        onSendMessage={handleMessageSend}
        disabled={connectionStatus !== 'connected'}
      />
    </Box>
  );
}