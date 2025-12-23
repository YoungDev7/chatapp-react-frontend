import { initializeSingleChatView } from '../components/InitializationHandler';
import { fetchChatViewDetails } from '../store/slices/chatViewSlice';
import type { AppDispatch } from '../store/store';


export interface NotificationDTO {
    chatViewId: string;
    notificationType: string;
}

export async function handleNotification(notification: NotificationDTO, dispatch: AppDispatch) {
    switch (notification.notificationType) {
        case 'ADDED_TO_CHATVIEW':
            await handleAddedToChatView(notification, dispatch);
            break;
        default:
            console.warn('Unknown notification type:', notification.notificationType);
    }
}

async function handleAddedToChatView(notification: NotificationDTO, dispatch: AppDispatch) {
    try {
        const result = await dispatch(fetchChatViewDetails(notification.chatViewId)).unwrap();
        initializeSingleChatView(result, dispatch);
    } catch (error) {
        console.error('Failed to initialize chat view:', error);
    }
}