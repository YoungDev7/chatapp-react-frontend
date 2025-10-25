/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../store/hooks';
import ChatMessage from './ChatMessage';

type Message = {
  text: string;
  senderName: string;
}

type Props = {
  messages: Message[];
}

//this component is container in which all messages are rendered
const MessageContainer = ({ messages }: Props) => {
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
        backgroundColor: '#6c757d',
        border: '2px solid #343a40',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto', // Ensure vertical scrolling
        height: '100%',    // Fill parent height
        minHeight: 0       // Fix flexbox overflow issue
      }}
    >
      {messages.map((message, index) => (
        <ChatMessage 
          key={index} 
          text={message.text} 
          sender={message.senderName} 
          isUser={message.senderName === user.name ? true : false} 
        />
      ))}
    </Box>
  );
};

export default MessageContainer;