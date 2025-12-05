import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import { useAppSelector } from '../../store/hooks';
import type { MessageContainerProps } from '../../types/messageContainerProps';
import { formatMessageTimestamp, shouldShowTimestamp } from '../../utils/timestampUtils';
import ChatMessage from './ChatMessage';

//this component is container in which all messages are rendered
const MessageContainer = ({ messages }: MessageContainerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAppSelector(state => state.auth); 
  const userAvatars = useAppSelector(state => state.chatView.userAvatars);


  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  if (!messages || !Array.isArray(messages)) {
    return (
      <Box 
        sx={{
          backgroundColor: (theme) => theme.palette.custom.secondaryDark,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          height: '100%',
          minHeight: 0
        }}
      />
    );
  }

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
        if (!message || !message.senderName || !message.text) {
          return null;
        }
        
        try {
          const showSender = index === 0 || messages[index - 1]?.senderName !== message.senderName;
          
          const currentMessageTime = message.createdAt ? new Date(message.createdAt) : null;
          const nextMessage = messages[index + 1];
          const nextMessageTime = nextMessage?.createdAt ? new Date(nextMessage.createdAt) : null;
          
          let showAvatar = false;
          
          if (index === messages.length - 1) {
            showAvatar = true;
          } else if (messages[index + 1]?.senderName !== message.senderName) {
            showAvatar = true;
          } else if (currentMessageTime && nextMessageTime) {
            const sameMinute = 
              currentMessageTime.getHours() === nextMessageTime.getHours() &&
              currentMessageTime.getMinutes() === nextMessageTime.getMinutes();
            showAvatar = !sameMinute;
          }
          
          let showTimestamp = false;
          if (message.createdAt) {
            const previousMessage = index > 0 ? messages[index - 1] : null;
            showTimestamp = shouldShowTimestamp(
              message.createdAt,
              previousMessage?.createdAt || null,
              message.senderName,
              previousMessage?.senderName || null
            );
          }

          const senderAvatarLink = userAvatars.get(message.senderUid) || '';

          
          return (
            <>
              {showTimestamp && message.createdAt && (
                <Box
                  sx={{
                    textAlign: 'center',
                    fontSize: '11px',
                    color: '#999',
                    margin: '12px 0 8px 0'
                  }}
                >
                  {formatMessageTimestamp(message.createdAt)}
                </Box>
              )}
              <ChatMessage 
                key={`message-${index}-${message.senderName}`}
                text={message.text} 
                sender={message.senderName} 
                senderUid={message.senderUid}
                senderAvatarLink={senderAvatarLink}
                isUser={message.senderName === user.name} 
                showSender={showSender}
                showAvatar={showAvatar}
                timestamp={undefined}
                showTimestamp={false}
              />
            </>
          );
        } catch (error) {
          console.error('Error rendering message at index', index, error, message);
          return null;
        }
      })}
    </Box>
  );
};

export default MessageContainer;