import {
  Box,
  Button,
  TextField
} from '@mui/material';
import { useState } from 'react';
import BaseModal from '../ui/BaseModal';

interface NewChatModalProps {
  open: boolean;
  onClose: () => void;
  onCreateChat: (chatName: string) => void;
}

/**
 * NewChatModal component for creating a new chat.
 * 
 * @param {NewChatModalProps} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Callback function when modal is closed
 * @param {function} props.onCreateChat - Callback function when chat is created
 * @returns {React.ReactElement} New chat modal
 */
export default function NewChatModal({ open, onClose, onCreateChat }: NewChatModalProps) {
  const [chatName, setChatName] = useState('');

  const handleCreate = () => {
    if (chatName.trim()) {
      onCreateChat(chatName.trim());
      setChatName('');
      onClose();
    }
  };

  const handleClose = () => {
    setChatName('');
    onClose();
  };

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Create New Chat"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        <TextField
          fullWidth
          label="Chat Name"
          variant="outlined"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleCreate();
            }
          }}
          autoFocus
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
            onClick={handleCreate}
            fullWidth
            disabled={!chatName.trim()}
            sx={{
              '&:disabled': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </BaseModal>
  );
}
