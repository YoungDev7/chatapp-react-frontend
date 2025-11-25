import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button
} from '@mui/material';
import React, { useState } from 'react';
import BaseModal from '../ui/BaseModal';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (avatarUrl: string) => void;
  currentAvatar?: string;
}

/**
 * AvatarModal component for changing user avatar.
 * 
 * Allows users to upload a new avatar image.
 * 
 * @returns {React.ReactElement} Avatar change modal
 */
export default function AvatarModal({ open, onClose, onSave }: Props): React.ReactElement {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (previewUrl) {
      onSave(previewUrl);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
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
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Avatar preview"
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

        <Button
          variant="outlined"
          component="label"
          sx={{
            color: 'white',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          Choose Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileSelect}
          />
        </Button>

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
            disabled={!selectedFile}
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
