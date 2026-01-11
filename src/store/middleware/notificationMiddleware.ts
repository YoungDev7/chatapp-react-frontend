import type { Middleware } from '@reduxjs/toolkit';
import { addMessage, incrementUnreadCount } from '../slices/chatViewSlice';

export const notificationMiddleware: Middleware = (store) => (next) => (action) => {
    const result = next(action);

    if (addMessage.match(action)) {
        const state = store.getState();
        const { user } = state.auth;
        const { currentlyDisplayedChatView } = state.chatView;
        const { id, message } = action.payload;

        // Only notify if message is from someone else and user is not viewing this chat
        if (message.senderUid !== user.uid && currentlyDisplayedChatView !== id) {
            store.dispatch(incrementUnreadCount(id));

            const chatView = state.chatView.chatViewCollection.find((cv: { id: string; title: string }) => cv.id === id);
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
