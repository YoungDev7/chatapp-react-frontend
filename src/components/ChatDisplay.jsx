// eslint-disable-next-line no-unused-vars
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import api from '../services/Api';
import '../style/ChatDisplay.css';
import MessageDisplay from './MessageDisplay';
import { useWebSocket } from './WebSocketProvider';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

export default function ChatDisplay() {
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { stompClient, connectionStatus } = useWebSocket(); 

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages');
      if (response.status === 200) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  //websocket message handling
  useEffect(() => {
    if (stompClient && connectionStatus === 'connected') {
      const subscription = stompClient.subscribe('/topic/messages', (message) => {
        const newMessage = JSON.parse(message.body);
        setMessages(prevMessages => [...prevMessages, newMessage]);
      });

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [stompClient, connectionStatus]);

  //SENDING MESSAGE
  function handleMessageSend() {
    if (stompClient && connectionStatus === 'connected') {
      stompClient.publish({
        destination: "/app/chat",
        body: JSON.stringify({ text: inputMessage, sender: 'mike hock' })
      });
      setInputMessage('');
    }
  }
  
  return (
    <>
    <Container style={{ maxWidth: '60vw', height: '80vh', marginTop: '1.2rem'}}>
        <Row style={{ height: '100%', marginBottom: '1.2rem' }}>
            <Col style={{ height: '100%' }}>
              <MessageDisplay messages={messages} />
            </Col>
        </Row>
        <Row>
            <Col>
              <Form.Control 
                className="bg-secondary text-white" 
                type='text' 
                id="inputMessage" 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)} 
                              />
            </Col>
            <Col xs={1} className='p-0'>
              <Button className="d-flex align-items-center" onClick={handleMessageSend}>
                Send <FontAwesomeIcon icon={faPaperPlane} className="ms-2" />
              </Button>
            </Col>
        </Row>
            </Container>
    </>
  )
}
