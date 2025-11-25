import { faArrowLeft, faCamera, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import AvatarModal from './chat/AvatarModal';

/**
 * Profile component that displays user information.
 * 
 * Shows the current user's profile details including name and email.
 * 
 * @returns {React.ReactElement} Profile page component
 */
export default function Profile(): React.ReactElement {
  const { user } = useAppSelector(state => state.auth);
  const navigate = useNavigate();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const handleAvatarSave = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
    // TODO: Save avatar to backend
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: (theme) => theme.palette.custom.mainDark,
        p: 3
      }}
    >
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          alignSelf: 'flex-start',
          mb: 2,
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="sm" />
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
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
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatarUrl || undefined}
              sx={{
                width: 120,
                height: 120,
                backgroundColor: (theme) => theme.palette.primary.main,
                fontSize: '3rem',
                border: '1px solid white'
              }}
            >
              {!avatarUrl && <FontAwesomeIcon icon={faUser} />}
            </Avatar>
            <IconButton
              onClick={() => setAvatarModalOpen(true)}
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: (theme) => theme.palette.primary.main,
                color: 'white',
                width: 40,
                height: 40,
                border: '1px solid white',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.primary.dark
                }
              }}
            >
              <FontAwesomeIcon icon={faCamera} />
            </IconButton>
          </Box>
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

      <AvatarModal
        open={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        onSave={handleAvatarSave}
        currentAvatar={avatarUrl || undefined}
      />
    </Box>
  );
}
