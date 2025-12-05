import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  TextField
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import BaseModal from './ui/BaseModal';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (avatarUrl: string) => void;
  currentAvatar?: string;
}

/**
 * AvatarModal component for changing user avatar.
 * 
 * Allows users to provide an avatar URL.
 * 
 * @returns {React.ReactElement} Avatar change modal
 */
export default function AvatarModal({ open, onClose, onSave, currentAvatar }: Props): React.ReactElement {
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar || '');
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (open) {
      setAvatarUrl(currentAvatar || '');
    }
  }, [open, currentAvatar]);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = () => {
    if (avatarUrl.trim()) {
      onSave(avatarUrl.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setAvatarUrl('');
    setPreviewError(false);
    onClose();
  };

  const handleImageError = () => {
    setPreviewError(true);
  };

  const handleImageLoad = () => {
    setPreviewError(false);
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Change Avatar"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3
        }}
      >
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {avatarUrl && !previewError ? (
            <img
              src={avatarUrl}
              alt="Avatar preview"
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <FontAwesomeIcon
              icon={faCamera}
              size="3x"
              style={{ color: 'rgba(255, 255, 255, 0.3)' }}
            />
          )}
        </Box>

        <TextField
          fullWidth
          label="Avatar URL"
          variant="outlined"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSave();
            }
          }}
          autoFocus
          placeholder="https://example.com/avatar.jpg"
          error={previewError && isValidUrl(avatarUrl)}
          helperText={previewError && isValidUrl(avatarUrl) ? 'Could not load image preview (CORS issue). URL format is valid.' : ''}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#1976d2',
              },
            },
            '& .MuiInputLabel-root': {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#1976d2',
            },
            '& .MuiFormHelperText-root': {
              color: '#f44336',
            },
          }}
        />

        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            fullWidth
            sx={{
              color: 'gray',
              borderColor: 'gray',
              '&:hover': {
                borderColor: 'white',
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            fullWidth
            disabled={!avatarUrl.trim() || !isValidUrl(avatarUrl)}
            sx={{
              '&:disabled': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </BaseModal>
  );
}
