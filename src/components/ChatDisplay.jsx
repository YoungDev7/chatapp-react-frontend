// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { useWebSocket } from './WebSocketProvider';
import MessageDisplay from './MessageDisplay';


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function ChatDisplay() {
  const [inputMessage, setInputMessage] = useState('')
  const [messages, setMessages] = useState([]);
  const stompClient = useWebSocket();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/messages');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setMessages(prevMessages => [...prevMessages, ...data]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  //websocket message handling
  useEffect(() => {
    if (stompClient) {
      const subscription = stompClient.subscribe('/topic/messages', (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages(prevMessages => [...prevMessages, newMessage]);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [stompClient]);



  //SENDING MESSAGE
  function handleMessageSend() {
    if (stompClient) {
      stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify({ text: inputMessage, sender: 'Mike' })
      });
      setInputMessage('');
    }
  }
  
  
  return (
    <>
    <Container className='centeredContainer' fluid >
        <Row>
            <Col>
              <MessageDisplay messages={messages} />
            </Col>
        </Row>
        <Row>
            <Col className='formControlContainer'>
                <Form.Control type='text' id="inputMessage" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
                <Button onClick={handleMessageSend}>Send <FontAwesomeIcon icon={faPaperPlane} /></Button>
            </Col>
        </Row>
    </Container>
    </>
  )
}
