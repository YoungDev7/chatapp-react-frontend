import { Box, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { markAsRead } from '../../store/slices/chatViewSlice';
import type { ChatViewProps } from '../../types/chatViewProps';
import { useLayout } from '../Layout';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import MessageContainer from './MessageContainer';

/**
 * ChatView component that displays the main chat interface.
 * 
 * This component handles:
 * - Displaying chat messages
 * - Sending new messages through STOMP client
 * - Message input and send functionality
 * 
 * Note: WebSocket subscriptions are now managed globally in WebSocketHandler,
 * so this component no longer handles subscriptions directly.
 * 
 * @returns {React.ReactElement} Chat interface with message display and input
 */
export default function ChatView({ viewId }: ChatViewProps) {
  const dispatch = useAppDispatch();
  const { stompClient, connectionStatus } = useAppSelector(state => state.ws);
  const { toggleDrawer, isMobile } = useLayout();
  const chatView = useAppSelector(
    state => state.chatView.chatViewCollection.find(view => view.viewId === viewId),
    shallowEqual
  );

  // Mark chat as read when it becomes the active view
  useEffect(() => {
    if (viewId) {
      dispatch(markAsRead(viewId));
    }
  }, [viewId, dispatch]);

  //SENDING MESSAGE
  function handleMessageSend(message: string) {
    if (stompClient && connectionStatus === 'connected') {
      stompClient.publish({
        destination: `/app/chatview/${viewId}`,
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
      <ChatHeader 
        title={chatView?.title || '{chatview title}'}
        isMobile={isMobile}
        onMenuClick={toggleDrawer}
      />

      {chatView?.isLoading ? (
        <Box 
          sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
        >
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
            <MessageContainer messages={chatView?.messages || []} />
          </Box>

          <ChatInput 
            onSendMessage={handleMessageSend}
            disabled={connectionStatus !== 'connected'}
          />
        </>
      )}
    </Box>
  );
}