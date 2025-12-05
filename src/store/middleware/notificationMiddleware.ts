import type { Middleware } from '@reduxjs/toolkit';
import { addMessage, incrementUnreadCount } from '../slices/chatViewSlice';

export const notificationMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);

    if (addMessage.match(action)) {
        const state = store.getState();
        const { user } = state.auth;
        const { viewId, message } = action.payload;
        
        // Only notify if message is from someone else
        if (message.senderName !== user.name) {
            store.dispatch(incrementUnreadCount(viewId));
            
            const chatView = state.chatView.chatViewCollection.find((cv: { viewId: string; title: string }) => cv.viewId === viewId);
            if (chatView && typeof Notification !== 'undefined' && Notification.permission === 'granted') {
                new Notification(`New message in ${chatView.title}`, {
                    body: `${message.senderName}: ${message.text}`,
                    icon: '/vite.svg'
                });
            }
        }
    }

    return result;
};
