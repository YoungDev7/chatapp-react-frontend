/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import { Client } from '@stomp/stompjs';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import SockJS from 'sockjs-client';

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export default function WebSocketProvider({ children }) {
    const [stompClient, setStompClient] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'connecting', 'connected', 'disconnected', 'error'
    const { token } = useSelector(state => state.auth);

    useEffect(() => {
        if(!token) {
            console.log("cannot connect to websocket, token is null or undefined");
            setConnectionStatus('disconnected');
            setStompClient(null);
            return;
        }
        
        setConnectionStatus('connecting');
        setStompClient(null);
        
        // STOMP client
        const client = new Client({
            webSocketFactory: () => new SockJS(`http://localhost:8080/ws?token=Bearer ${encodeURIComponent(token)}`),
            connectHeaders: {
                Authorization: `Bearer ${token}`, 
            },
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onStompError = (frame) => {
            console.error('STOMP error:', frame);
            setConnectionStatus('error');
            setStompClient(null);
        };

        client.onWebSocketError = (event) => {
            console.error('WebSocket error:', event);
            setConnectionStatus('error');
            setStompClient(null);
        };

        client.onConnect = () => {
            console.log('Connected to WebSocket');
            setConnectionStatus('connected');
            setStompClient(client);
        };
        
        client.onDisconnect = () => {
            console.log('Disconnected from websocket');
            setConnectionStatus('disconnected');
            setStompClient(null);
        };

        client.onWebSocketClose = (event) => {
            console.log('WebSocket closed: ', event.code, event.reason);
            setConnectionStatus('disconnected');
            setStompClient(null);
        };

        client.activate();

        // Cleanup 
        return () => {
            if (client.active) {
                client.deactivate();
            }
            setConnectionStatus('disconnected');
            setStompClient(null);
        };
    }, [token]);

    // Provide the WebSocket client and connection status to children components
    return (
        <WebSocketContext.Provider value={{ stompClient, connectionStatus }}>
            {children}
        </WebSocketContext.Provider>
    );
}

