import {
  Box,
  Button,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  CircularProgress,
  Typography,
  Paper
} from '@mui/material';
import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { addChatView } from '../../store/slices/chatViewSlice';
import BaseModal from '../ui/BaseModal';
import { searchUser, type User } from '../../utils/userUtils';
import { createChat, addUsersToChat } from '../../utils/newChatUtils';

interface NewChatModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * NewChatModal component for creating a new chat.
 * Allows users to:
 * - Enter a chat name
 * - Search for and select users to add
 * - Create a chat with at least one other user
 * 
 * @param {NewChatModalProps} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Callback function when modal is closed
 * @param {function} props.onCreateChat - Callback function when chat is created
 * @returns {React.ReactElement} New chat modal with user search
 */
export default function NewChatModal({ open, onClose }: NewChatModalProps) {
  const dispatch = useAppDispatch();
  
  const [chatName, setChatName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search for users with debounce
  const searchUsers = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setError(null);
    try {
      const foundUser = await searchUser(query);
      
      if (!foundUser) {
        setSearchResults([]);
        setError(null);
        return;
      }
      
      // Don't show already selected users in search results
      const isAlreadySelected = selectedUsers.some(u => u.uid === foundUser.uid);
      setSearchResults(isAlreadySelected ? [] : [foundUser]);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to search users';
      console.error('Error searching users:', err);
      setError(errorMsg);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [selectedUsers]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers]);

  const handleSelectUser = (user: User) => {
    setSelectedUsers([...selectedUsers, user]);
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
  };

  const handleRemoveUser = (userUid: string) => {
    setSelectedUsers(selectedUsers.filter(u => u.uid !== userUid));
  };

  const handleCreate = async () => {
    if (!chatName.trim()) {
      setError('Chat name is required');
      return;
    }

    if (selectedUsers.length === 0) {
      setError('Please add at least one user to the chat');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      // Create chat with title
      const newChatId = await createChat(chatName.trim());

      // Add selected users to the chat
      await addUsersToChat(newChatId, selectedUsers);

      // Update Redux state
      dispatch(addChatView({
        viewId: newChatId,
        title: chatName.trim(),
        messages: [],
        isLoading: false,
        error: null
      }));

      // Reset state
      setChatName('');
      setSelectedUsers([]);
      setSearchQuery('');
      setSearchResults([]);
      onClose();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create chat';
      console.error('Error creating chat:', err);
      setError(errorMsg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setChatName('');
    setSelectedUsers([]);
    setSearchQuery('');
    setSearchResults([]);
    setError(null);
    onClose();
  };

  const isCreateDisabled = !chatName.trim() || selectedUsers.length === 0 || isCreating;

  return (
    <BaseModal
      open={open}
      onClose={handleClose}
      title="Create New Chat"
    >
      <Box
        sx={{
          paddingTop: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <TextField
          fullWidth
          label="Chat Name"
          variant="outlined"
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isCreateDisabled) {
              e.preventDefault();
              handleCreate();
            }
          }}
          autoFocus
          disabled={isCreating}
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

        {/* User Search Input */}
        <TextField
          fullWidth
          label="Search for users"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isCreating}
          placeholder="Search by username or email"
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

        {searchQuery.trim() && (
          <Paper
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              maxHeight: '200px',
              overflowY: 'auto',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 1
            }}
          >
            {isSearching ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : error ? (
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ color: '#ff6b6b' }}>
                  {error}
                </Typography>
              </Box>
            ) : searchResults.length > 0 ? (
              <List sx={{ p: 0 }}>
                {searchResults.map((user) => (
                  <ListItemButton
                    key={user.uid}
                    onClick={() => handleSelectUser(user)}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <ListItemText
                      primary={user.name}
                      secondary={user.email}
                      sx={{
                        '& .MuiListItemText-primary': {
                          color: 'white',
                        },
                        '& .MuiListItemText-secondary': {
                          color: 'rgba(255, 255, 255, 0.6)',
                        }
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                  No users found
                </Typography>
              </Box>
            )}
          </Paper>
        )}

        {selectedUsers.length > 0 && (
          <Box>
            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              Selected users ({selectedUsers.length}):
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {selectedUsers.map((user) => (
                <Chip
                  key={user.uid}
                  label={user.name}
                  onDelete={() => handleRemoveUser(user.uid)}
                  sx={{
                    backgroundColor: 'rgba(25, 118, 210, 0.5)',
                    color: 'white',
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': {
                        color: 'white',
                      }
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {error && !searchQuery.trim() && (
          <Typography variant="body2" sx={{ color: '#ff6b6b' }}>
            {error}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 2, width: '100%', mt: 1 }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            fullWidth
            disabled={isCreating}
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
            disabled={isCreateDisabled}
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