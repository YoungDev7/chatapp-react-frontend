import {
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper
} from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { handleLogout } from '../store/slices/authSlice';

/**
 * Sidebar component that provides navigation and user actions.
 * 
 * Contains navigation links for the application and a logout button.
 * The logout functionality dispatches a logout action to clear user session
 * and authentication state.
 * 
 * @returns {React.ReactElement} Sidebar navigation component
 */
export default function Sidebar() {
  const dispatch = useDispatch();

  return (
      <Paper
        elevation={2} 
        sx={{ 
          height: '100vh',
          backgroundColor: 'primary.main',
          borderRadius: 0,
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          p: 2
        }}
    >
      <List sx={{ flexGrow: 1 }}>
        <ListItem disablePadding>
          <ListItemButton 
            href="/"
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <ListItemText primary="Chat" />
          </ListItemButton>
        </ListItem>
      </List>
      
      <Button
        onClick={() => dispatch(handleLogout())}
        variant="outlined"
        sx={{
          color: 'white',
          borderColor: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderColor: 'white'
          }
        }}
      >
        Logout
      </Button>
    </Paper>
  );
}
