/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import { Client } from '@stomp/stompjs';
import { createContext, useContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthProvider';

// Create a context for the WebSocket client
const WebSocketContext = createContext(null);

// Custom hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);

export default function WebSocketProvider({ children }) {
    const [stompClient, setStompClient] = useState(null);
    const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'connecting', 'connected', 'disconnected', 'error'
    const { token } = useAuth();

    useEffect(() => {
        if(!token) {
            console.log("cannot connect to websocket, token is null or undefined");
            setConnectionStatus('disconnected');
            return;
        }
        
        setConnectionStatus('connecting');
        
        // Create a new STOMP client
        const client = new Client({
            webSocketFactory: () => new SockJS(`http://localhost:8080/ws?token=Bearer ${encodeURIComponent(token)}`),
            connectHeaders: {
                Authorization: `Bearer ${token}`,  // Keep for STOMP protocol after connection
            },
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        // Add error handling
        client.onStompError = (frame) => {
            console.error('STOMP error:', frame);
            setConnectionStatus('error');
        };

        client.onWebSocketError = (event) => {
            console.error('WebSocket error:', event);
            setConnectionStatus('error');
        };

        // Set the client on successful connection
        client.onConnect = () => {
            console.log('Connected to WebSocket');
            setConnectionStatus('connected');
            setStompClient(client);
        };
        
        client.onDisconnect = () => {
            console.log('Disconnected from WebSocket');
            setConnectionStatus('disconnected');
        };

        // Activate the client
        client.activate();

        // Cleanup function to deactivate the client on unmount
        return () => {
            if (client.active) {
                client.deactivate();
            }
            setConnectionStatus('disconnected');
        };
    }, [token]);

    // Provide the WebSocket client and connection status to children components
    return (
        <WebSocketContext.Provider value={{ stompClient, connectionStatus }}>
            {children}
        </WebSocketContext.Provider>
    );
}

