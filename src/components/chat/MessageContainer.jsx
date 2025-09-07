/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
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
    <div className="bg-secondary border border-dark border-2 d-flex flex-column overflow-auto" ref={containerRef} style={{ height: '100%' }}>
      {messages.map((message) => (
        <ChatMessage key={message.id} text={message.text} sender={message.sender.name} isUser={ message.sender.uid === user.uid ? true : false } />
      ))}
    </div>
  );
};

export default MessageContainer;