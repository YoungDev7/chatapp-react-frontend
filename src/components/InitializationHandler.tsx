import { useEffect, type ReactNode } from 'react';
import { useAppDispatch } from '../store/hooks';
import { addChatView, addUserAvatars, fetchAllMessages, fetchChatViews, fetchMessagesFromQueue, setIsLoadingChatViews } from '../store/slices/chatViewSlice';

export default function InitializationHandler({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
  
    useEffect(() => {
        const initializeChatViews = async () => {
            try {
                const result = await dispatch(fetchChatViews()).unwrap();

                result.forEach((chatView: { id: string; name: string, messageCount: number, userAvatars: Record<string, string> }) => {
                    const storedMessages = localStorage.getItem(`messages_${chatView.id}`);
                    let parsedStoredmessages = [];

                    if (storedMessages) {
                      try {
                        const parsed = JSON.parse(storedMessages);
                        if (Array.isArray(parsed)) {
                            parsedStoredmessages = parsed;
                        }
                      } catch {
                        parsedStoredmessages = [];
                      }
                    }

                    console.log("cw ", chatView);
                    console.log("msgs ", parsedStoredmessages)

                    dispatch(addChatView({
                        viewId: chatView.id,
                        title: chatView.name,
                        messages: parsedStoredmessages,
                    }));

                    if (chatView.userAvatars) {
                        dispatch(addUserAvatars(chatView.userAvatars));
                    }

                    console.log("stored lenght", parsedStoredmessages.length);
                    console.log("fetched lenght", chatView.messageCount);
                    
                    if ((parsedStoredmessages.length === 0 && chatView.messageCount > 0) || (parsedStoredmessages.length > chatView.messageCount)){
                        dispatch(fetchAllMessages(chatView.id));
                        return;
                    }

                    if ((parsedStoredmessages.length != chatView.messageCount) && (parsedStoredmessages.length > 0 && chatView.messageCount > 0)){
                        dispatch(fetchMessagesFromQueue(chatView.id));
                        return;
                    }
                });
                
                dispatch(setIsLoadingChatViews(false));

            } catch (error) {
                console.error('Failed to initialize chat views:', error);
            }
        };

        initializeChatViews();
    }, [dispatch]);
    
    return children;
}
