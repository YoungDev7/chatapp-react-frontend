import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../store/hooks';
import type { MessageContainerProps } from '../../types/messageContainer';
import ChatMessage from './ChatMessage';

//this component is container in which all messages are rendered
const MessageContainer = ({ messages }: MessageContainerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAppSelector(state => state.auth); 

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <Box 
      ref={containerRef}
      sx={{
        backgroundColor: (theme) => theme.palette.custom.secondaryDark,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto', // Ensure vertical scrolling
        height: '100%',    // Fill parent height
        minHeight: 0       // Fix flexbox overflow issue
      }}
    >
      {messages.map((message, index) => {
        // Check if this is the first message or if the sender is different from the previous message
        const showSender = index === 0 || messages[index - 1].senderName !== message.senderName;
        
        return (
          <ChatMessage 
            key={index} 
            text={message.text} 
            sender={message.senderName} 
            isUser={message.senderName === user.name} 
            showSender={showSender}
          />
        );
      })}
    </Box>
  );
};

export default MessageContainer;