import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { handleLogout } from '../store/slices/authSlice';
import SearchBar from './chat/SearchBar';


/**
 * Sidebar component that provides navigation and user actions.
 * 
 * Contains navigation links for the application and a logout button.
 * The logout functionality dispatches a logout action to clear user session
 * and authentication state.
 * 
 * @returns {React.ReactElement} Sidebar navigation component
 */
export default function Sidebar(): React.ReactElement {
  const dispatch = useAppDispatch();
  const { chatViewCollection } = useAppSelector(state => state.chatView);

  return (
    <Paper
      elevation={2} 
      sx={{ 
        height: '100%',
        backgroundColor: (theme) => theme.palette.custom.secondaryDark,
        borderRadius: 2,
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

      <Box sx={{ mb: 2 }}>
        <SearchBar />
      </Box>

      <List sx={{ flexGrow: 1 }}>
        <ListItem 
          disablePadding
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 1,
            mb: 1
          }}
        >
          <ListItemButton 
            href="/"
            sx={{ 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)'
              }
            }}
          >
            <FontAwesomeIcon icon={faUsers} size="lg" />
            <ListItemText primary={chatViewCollection[0].title} />
          </ListItemButton>
        </ListItem>
      </List>
      
      <Button
      onClick={() => dispatch(handleLogout())}
            variant="outlined"
            sx={{
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
  </Paper>
  );
}
