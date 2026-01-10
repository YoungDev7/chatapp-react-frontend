import { Client } from '@stomp/stompjs';
import { useEffect, useRef, type ReactNode } from 'react';
import SockJS from 'sockjs-client';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addMessage } from '../../store/slices/chatViewSlice';
import { addSubscription, clearAllSubscriptions, setConnectionStatus, setStompClient } from '../../store/slices/wsSlice';
import type { ChatView } from '../../types/chatView';
import { handleNotification, type NotificationDTO } from '../../utils/notificationUtils';
import { getChatViewWSDestination } from '../../utils/wsUtils';


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
        if (!token) {
            console.log("cannot connect to websocket, token is null or undefined");
            dispatch(setConnectionStatus('disconnected'));
            dispatch(setStompClient(null));
            return;
        }

        if (isLoadingChatViews) {
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
        if (stompClient && connectionStatus === 'connected' && user.uid) {

            console.log("use effect was triggered");

            subscribeToNotifications();

            if (chatViewCollection.length == 0) {
                console.log("no chatviews to subscribe to");
                return;
            }

            // SUBSCRIBE TO CHATVIEWS
            chatViewCollection.forEach(chatView => {
                subscribeToChatView(chatView);
            });
        }

        if (connectionStatus !== 'connected') {
            subscribedViewsRef.current.clear();
            failedSubscriptionsRef.current.clear();
        }
    }, [stompClient, connectionStatus, chatViewCollection.length, user.uid, dispatch]);


    function subscribeToNotifications() {
        if (stompClient && connectionStatus === 'connected' && user.uid) {

            if (subscribedViewsRef.current.has("notifications")) {
                return;
            }

            const failCount = failedSubscriptionsRef.current.get("notifications") || 0;
            if (failCount >= MAX_RETRY_ATTEMPTS) {
                console.warn(`Skipping subscription to notifications - max retry attempts reached`);
                return;
            }

            try {
                const subscription = stompClient.subscribe('/user/queue/notifications', (message) => {
                    const notification = JSON.parse(message.body) as NotificationDTO;
                    console.log('Received notification:', notification);
                    handleNotification(notification, dispatch);
                });

                subscribedViewsRef.current.add("notifications");
                failedSubscriptionsRef.current.delete("notifications");
                dispatch(addSubscription({ id: "notifications", subscription }));
                console.log(`Subscribed to /user/notifications`);
            } catch (error) {
                console.error(`Failed to subscribe to /user/notifications:`, error);
                failedSubscriptionsRef.current.set("notifications", failCount + 1);
            }
        }
    }

    function subscribeToChatView(chatView: ChatView) {
        if (stompClient && connectionStatus === 'connected' && user.uid) {
            if (subscribedViewsRef.current.has(chatView.id)) {
                return;
            }

            const failCount = failedSubscriptionsRef.current.get(chatView.id) || 0;
            if (failCount >= MAX_RETRY_ATTEMPTS) {
                console.warn(`Skipping subscription to ${chatView.id} - max retry attempts reached`);
                return;
            }

            const destination = getChatViewWSDestination(chatView.id);

            try {
                const subscription = stompClient.subscribe(destination, (message: { body: string }) => {
                    const newMessage = JSON.parse(message.body);
                    console.log(`Received message in chatview ${chatView.id}:`, newMessage);
                    dispatch(addMessage({ id: chatView.id, message: newMessage }));
                });

                subscribedViewsRef.current.add(chatView.id);
                failedSubscriptionsRef.current.delete(chatView.id);
                dispatch(addSubscription({ id: chatView.id, subscription }));
                console.log(`Subscribed to ${destination}`);
            } catch (error) {
                console.error(`Failed to subscribe to ${destination}:`, error);
                failedSubscriptionsRef.current.set(chatView.id, failCount + 1);
            }
        }
    }

    return children;
}

