import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Box,
    CircularProgress,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import type { ChatView } from '../../types/chatView';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCurrentlyDisplayedChatView } from '../../store/slices/chatViewSlice';
import type { SidebarItemProps } from '../../types/sidebarItemProps';

export default function SidebarItem({ viewId, title, isLoading }: SidebarItemProps) {
    const dispatch = useAppDispatch();
    const { currentlyDisplayedChatView, chatViewCollection } = useAppSelector(state => state.chatView);
    const { user: currentUser } = useAppSelector(state => state.auth);
    
    const isActive = currentlyDisplayedChatView === viewId;
    
    const chatView = chatViewCollection.find((chat: ChatView) => chat.viewId === viewId);
    const lastMessage = chatView?.messages && chatView.messages.length > 0 
      ? chatView.messages[chatView.messages.length - 1] 
      : null;
    const unreadCount = chatView?.unreadCount ?? 0;
    const hasUnread = unreadCount > 0 && !isActive;
    
    const senderDisplayName = lastMessage?.senderUid === currentUser.uid ? 'You' : lastMessage?.senderName;
    
    return (
        <>
        <ListItem 
        disablePadding
        sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 1,
            mb: 1
        }}
        >
            <ListItemButton 
                onClick={() => dispatch(setCurrentlyDisplayedChatView(viewId))}
                sx={{ 
                color: isLoading ? 'rgba(255, 255, 255, 0.5)' : 'white',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                border: isActive ? 1 : 0,
                borderColor: isActive ? 'primary.main' : 'transparent',
                borderRadius: 1,
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)'
                },
                py: 1.5,
                }}
            >
                <FontAwesomeIcon icon={faUsers} size="lg" />
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                        <ListItemText 
                            primary={title}
                            primaryTypographyProps={{
                                noWrap: true,
                                sx: { fontWeight: hasUnread ? 700 : 600 }
                            }}
                        />
                        {hasUnread && (
                            <Box
                                sx={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: '50%',
                                    backgroundColor: '#2196F3'
                                }}
                            />
                        )}
                    </Box>
                    {lastMessage && (
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: hasUnread ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: 'block',
                                fontWeight: hasUnread ? 600 : 400
                            }}
                        >
                            {senderDisplayName}: {lastMessage.text}
                        </Typography>
                    )}
                </Box>
                {isLoading && (
                    <CircularProgress 
                        size={20} 
                        sx={{ color: 'white', ml: 'auto' }} 
                    />
                )}
            </ListItemButton>
        </ListItem>
        </>
  )
}
