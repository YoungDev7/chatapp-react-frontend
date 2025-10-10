/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import ChatMessage from './ChatMessage';

//this component is container in which all messages are rendered
const MessageContainer = ({ messages }) => {
  const containerRef = useRef(null);
  const { user } = useSelector(state => state.auth); 

  useEffect(() => {
    const container = containerRef.current;
    container.scrollTop = container.scrollHeight;
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
      {messages.map((message) => (
        <ChatMessage 
          key={message.id} 
          text={message.text} 
          sender={message.sender.name} 
          isUser={message.sender.uid === user.uid ? true : false} 
        />
      ))}
    </Box>
  );
};

export default MessageContainer;