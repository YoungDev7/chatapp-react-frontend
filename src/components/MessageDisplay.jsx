/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import '../style/MessageDisplay.css';

const MessageDisplay = ({ messages }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div className="bg-secondary border border-dark border-2 d-flex flex-column overflow-auto" ref={containerRef} style={{ height: '100%' }}>
      {messages.map((message) => (
        <ChatMessage key={message.id} text={message.text} sender={message.sender} isUser={false} />
      ))}
    </div>
  );
};

export default MessageDisplay;