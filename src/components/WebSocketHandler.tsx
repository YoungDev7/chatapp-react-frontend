/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import { Client } from '@stomp/stompjs';
import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setConnectionStatus, setStompClient } from '../store/slices/wsSlice';

/**
 * WebSocketHandler component that manages WebSocket connection lifecycle.
 * 
 * This component:
 * - Establishes STOMP WebSocket connection when authenticated
 * - Handles connection states (connecting, connected, disconnected, error)
 * - Automatically reconnects on connection loss
 * - Includes authentication token in connection headers
 * - Manages connection cleanup on component unmount or token changes
 * 
 * The WebSocket connection is only established when a valid authentication token exists.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.ReactNode} The child components
 */
export default function WebSocketHandler({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const { token } = useAppSelector(state => state.auth);
    const env: ImportMetaEnv & { VITE_WS_BASE_URL?: string } = import.meta.env;

    useEffect(() => {
        if(!token) {
            console.log("cannot connect to websocket, token is null or undefined");
            dispatch(setConnectionStatus('disconnected'));
            dispatch(setStompClient(null));
            return;
        }
        
        dispatch(setConnectionStatus('connecting'));
        dispatch(setStompClient(null));
        
        // STOMP client
        const client = new Client({
                webSocketFactory: () => new SockJS(`${env.VITE_WS_BASE_URL}?token=Bearer ${encodeURIComponent(token)}`),
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
            dispatch(setConnectionStatus('error'));
            dispatch(setStompClient(null));
        };

        client.onWebSocketError = (event) => {
            console.error('WebSocket error:', event);
            dispatch(setConnectionStatus('error'));
            dispatch(setStompClient(null));
        };

        client.onConnect = () => {
            console.log('Connected to WebSocket');
            dispatch(setConnectionStatus('connected'));
            dispatch(setStompClient(client));
        };
        
        client.onDisconnect = () => {
            console.log('Disconnected from websocket');
            dispatch(setConnectionStatus('disconnected'));
            dispatch(setStompClient(null));
        };

        client.onWebSocketClose = (event) => {
            console.log('WebSocket closed: ', event.code, event.reason);
            dispatch(setConnectionStatus('disconnected'));
            dispatch(setStompClient(null));
        };

        client.activate();

        // Cleanup 
        return () => {
            if (client.active) {
                client.deactivate();
            }
            dispatch(setConnectionStatus('disconnected'));
            dispatch(setStompClient(null));
        };
    }, [token]);

    return children;
}

