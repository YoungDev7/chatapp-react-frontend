import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  List,
  Paper,
  Typography
} from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { handleLogout } from '../../store/slices/authSlice';
import NewChatButton from '../chat/NewChatButton';
import NewChatModal from '../chat/NewChatModal';
import SearchBar from '../ui/SearchBar';
import SidebarItem from './SidebarItem';


/**
 * Sidebar component that provides navigation and user actions.
 * 
 * Contains navigation links for the application and a logout button.
 * The logout functionality dispatches a logout action to clear user session
 * and authentication state.
 * 
 * @returns {React.ReactElement} Sidebar navigation component
 */
export default function Sidebar({ isMobile = false }: { isMobile?: boolean }): React.ReactElement {
  const dispatch = useAppDispatch();
  const { chatViewCollection } = useAppSelector(state => state.chatView);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) {
      return chatViewCollection;
    }
    return chatViewCollection.filter(chat => 
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chatViewCollection, searchQuery]);

  const handleCreateChat = (chatName: string) => {
    // TODO: Implement create chat logic
    console.log('Creating chat:', chatName);
  };

  return (
    <Paper
      elevation={isMobile ? 0 : 2} 
      sx={{ 
        height: '100%',
        backgroundColor: (theme) => theme.palette.custom.secondaryDark,
        borderRadius: isMobile ? 0 : 2,
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        p: 2
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>
          Chats
        </Typography>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <NewChatButton onClick={() => setIsNewChatModalOpen(true)} />
      </Box>

      <NewChatModal
        open={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        onCreateChat={handleCreateChat}
      />

      <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <SidebarItem key={chat.viewId} viewId={chat.viewId} title={chat.title} isLoading={chat.isLoading} />
          ))
        ) : (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100px',
              color: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <Typography variant="body2">No matches found</Typography>
          </Box>
        )}
      </List>
      
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          href="/profile"
          variant="outlined"
          sx={{
            width: '15%',
            minWidth: 0,
            color: 'gray',
            borderColor: 'gray',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'white',
              color: 'white'
            }
          }}
        >
          <FontAwesomeIcon icon={faUser} />
        </Button>
        <Button
          onClick={() => dispatch(handleLogout())}
          variant="outlined"
          sx={{
            flex: 1,
            color: 'gray',
            borderColor: 'gray',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'white',
              color: 'white'
            }
          }}
        >
          Logout
        </Button>
      </Box>
  </Paper>
  );
}
