// eslint-disable-next-line no-unused-vars
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage, fetchMessages } from '../../store/slices/chatViewSlice';
import MessageContainer from './MessageContainer';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

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
  const [inputMessage, setInputMessage] = useState('');
  const { chatViewCollection } = useSelector(state => state.chatView);
  const { stompClient, connectionStatus } = useSelector(state => state.ws);
  const { user } = useSelector(state => state.auth); 
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMessages());
  }, []);

  //websocket message handling
  useEffect(() => {
    if (stompClient && connectionStatus === 'connected') {
      const subscription = stompClient.subscribe('/topic/messages', (message) => {
        const newMessage = JSON.parse(message.body);
        dispatch(addMessage(newMessage));
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
        body: JSON.stringify({ text: inputMessage, sender: user.name, senderUid: user.uid })
      });
      setInputMessage('');
    }
  }
  
  return (
    <>
    <Container style={{ maxWidth: '60vw', height: '80vh', marginTop: '1.2rem'}}>
        <Row style={{ height: '100%', marginBottom: '1.2rem' }}>
            <Col style={{ height: '100%' }}>
              <MessageContainer messages={chatViewCollection[0].messages} />
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
              <Button className="d-flex align-items-center" type="submit" onClick={handleMessageSend}>
                Send <FontAwesomeIcon icon={faPaperPlane} className="ms-2" />
              </Button>
            </Col>
        </Row>
    </Container>
    </>
  )
}
