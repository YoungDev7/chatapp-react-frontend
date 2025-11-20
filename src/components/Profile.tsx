import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import React from 'react';
import { useAppSelector } from '../store/hooks';

/**
 * Profile component that displays user information.
 * 
 * Shows the current user's profile details including name and email.
 * 
 * @returns {React.ReactElement} Profile page component
 */
export default function Profile(): React.ReactElement {
  const { user } = useAppSelector(state => state.auth);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: (theme) => theme.palette.custom.mainDark,
        p: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 600,
          width: '100%',
          backgroundColor: (theme) => theme.palette.custom.secondaryDark,
          color: 'white',
          p: 4,
          borderRadius: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              backgroundColor: (theme) => theme.palette.primary.main,
              fontSize: '3rem'
            }}
          >
            <FontAwesomeIcon icon={faUser} />
          </Avatar>
        </Box>

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', mb: 3 }} />

        <List>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  Username
                </Typography>
              }
              secondary={
                <Typography variant="h6" color="white">
                  {user.name}
                </Typography>
              }
            />
          </ListItem>
          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary={
                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                  Email
                </Typography>
              }
              secondary={
                <Typography variant="h6" color="white">
                  {user.email || 'Not provided'}
                </Typography>
              }
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}
