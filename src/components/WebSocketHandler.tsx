import { Client } from '@stomp/stompjs';
import { useEffect, useRef, type ReactNode } from 'react';
import SockJS from 'sockjs-client';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addMessage } from '../store/slices/chatViewSlice';
import { addSubscription, clearAllSubscriptions, setConnectionStatus, setStompClient } from '../store/slices/wsSlice';

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
export default function WebSocketHandler({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const { token, user } = useAppSelector(state => state.auth);
    const { isLoadingChatViews, chatViewCollection } = useAppSelector(state => state.chatView);
    const { stompClient, connectionStatus } = useAppSelector(state => state.ws);
    const env = import.meta.env;
    
    // Track subscribed views to prevent race conditions
    const subscribedViewsRef = useRef<Set<string>>(new Set());
    // Track failed subscriptions to prevent infinite retry loops
    const failedSubscriptionsRef = useRef<Map<string, number>>(new Map());
    const MAX_RETRY_ATTEMPTS = 3;

    useEffect(() => {
        if(!token) {
            console.log("cannot connect to websocket, token is null or undefined");
            dispatch(setConnectionStatus('disconnected'));
            dispatch(setStompClient(null));
            return;
        }

        if(isLoadingChatViews){
            console.log("chatveiws are loading, cannot connect to websocket yet");
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
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const subscribedViews = subscribedViewsRef.current;
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const failedSubscriptions = failedSubscriptionsRef.current;
            if (client.active) {
                dispatch(clearAllSubscriptions());
                client.deactivate();
            }
            subscribedViews.clear();
            failedSubscriptions.clear();
            dispatch(setConnectionStatus('disconnected'));
            dispatch(setStompClient(null));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, isLoadingChatViews, dispatch]);

    // Subscribe to all chat views when connected and subscribe to new ones when added
    useEffect(() => {
        if (stompClient && connectionStatus === 'connected' && chatViewCollection.length > 0 && user.uid) {
            console.log('Checking chat view subscriptions...');
            
            chatViewCollection.forEach(chatView => {
                // Skip if already subscribed
                if (subscribedViewsRef.current.has(chatView.viewId)) {
                    return;
                }
                
                // Skip if failed too many times
                const failCount = failedSubscriptionsRef.current.get(chatView.viewId) || 0;
                if (failCount >= MAX_RETRY_ATTEMPTS) {
                    console.warn(`Skipping subscription to ${chatView.viewId} - max retry attempts reached`);
                    return;
                }
                
                const destination = `/topic/chatview.${chatView.viewId}.user.${user.uid}`;
                
                try {
                    const subscription = stompClient.subscribe(destination, (message: { body: string }) => {
                        const newMessage = JSON.parse(message.body);
                        console.log(`Received message in chatview ${chatView.viewId}:`, newMessage);
                        dispatch(addMessage({ viewId: chatView.viewId, message: newMessage }));
                    });
                    
                    // Mark as subscribed immediately to prevent duplicate subscriptions
                    subscribedViewsRef.current.add(chatView.viewId);
                    // Clear any previous failure count on success
                    failedSubscriptionsRef.current.delete(chatView.viewId);
                    dispatch(addSubscription({ viewId: chatView.viewId, subscription }));
                    console.log(`Subscribed to ${destination}`);
                } catch (error) {
                    console.error(`Failed to subscribe to ${destination}:`, error);
                    // Increment failure count
                    failedSubscriptionsRef.current.set(chatView.viewId, failCount + 1);
                }
            });
        }
        
        // Clear tracking when disconnected to allow fresh retry on reconnect
        if (connectionStatus !== 'connected') {
            subscribedViewsRef.current.clear();
            failedSubscriptionsRef.current.clear();
        }
    }, [stompClient, connectionStatus, chatViewCollection, user.uid, dispatch]);

    return children;
}

