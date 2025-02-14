/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

// Create a context for the WebSocket client
const WebSocketContext = createContext(null);

// Custom hook to use the WebSocket context
export const useWebSocket = () => useContext(WebSocketContext);

export default function WebSocketProvider({ children }) {
    const [stompClient, setStompClient] = useState(null);

    useEffect(() => {
        // Create a new STOMP client
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            connectHeaders: {},
            debug: (str) => {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        // Activate the client
        client.activate();

        // Set the client on successful connection
        client.onConnect = () => {
            console.log('Connected to WebSocket');
            setStompClient(client);
        };

        // Cleanup function to deactivate the client on unmount
        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, []);

    // Provide the WebSocket client to children components
    return (
        <WebSocketContext.Provider value={stompClient}>
            {children}
        </WebSocketContext.Provider>
    );
}

