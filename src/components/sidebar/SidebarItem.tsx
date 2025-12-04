import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    CircularProgress,
    ListItem,
    ListItemButton,
    ListItemText,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setCurrentlyDisplayedChatView } from '../../store/slices/chatViewSlice';
import type { SidebarItemProps } from '../../types/sidebarItemProps';

export default function SidebarItem({ viewId, title, isLoading }: SidebarItemProps) {
    const dispatch = useAppDispatch();
    const { currentlyDisplayedChatView } = useAppSelector(state => state.chatView);
    
    const isActive = currentlyDisplayedChatView === viewId;
    
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
                }
                }}
            >
                <FontAwesomeIcon icon={faUsers} size="lg" />
                <ListItemText primary={title} />
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
