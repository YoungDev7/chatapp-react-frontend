import { faCamera, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Typography
} from '@mui/material';
import React, { useState } from 'react';

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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: (theme) => theme.palette.custom.secondaryDark,
          color: 'white',
          borderRadius: 2
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Change Avatar
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3 }}>
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
      </DialogContent>
    </Dialog>
  );
}
