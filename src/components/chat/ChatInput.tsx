import { faFaceSmile, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Button,
  IconButton,
  TextField
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import EmojiPickerComponent from './EmojiPickerComponent';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

/**
 * ChatInput component that handles message input with emoji picker.
 * 
 * @param {ChatInputProps} props - Component props
 * @param {function} props.onSendMessage - Callback function when message is sent
 * @param {boolean} props.disabled - Whether the input is disabled
 * @returns {React.ReactElement} Chat input interface with emoji picker
 */
export default function ChatInput({ onSendMessage, disabled = false }: ChatInputProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showEmojiPicker]);

  function handleMessageSend() {
    if (inputMessage.trim().length > 0) {
      onSendMessage(inputMessage);
      setInputMessage('');
      setShowEmojiPicker(false);
    }
  }

  function handleEmojiClick(emojiData: { emoji: string }) {
    setInputMessage(prev => prev + emojiData.emoji);
  }

  return (
    <Box 
      sx={{ 
        backgroundColor: (theme) => theme.palette.custom.secondaryDark,
        display: 'flex',
        gap: 1,
        p: 1,
        flexShrink: 0,
        alignItems: 'center',
        position: 'relative'
      }}
    >
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiPickerComponent 
          onEmojiClick={handleEmojiClick}
          emojiPickerRef={emojiPickerRef}
        />
      )}

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          flexGrow: 1,
          backgroundColor: '#424242',
          borderRadius: '4px',
          border: '1px solid #666',
          '&:hover': {
            borderColor: '#888',
          },
          '&:focus-within': {
            borderColor: '#1976d2',
          }
        }}
      >
        <TextField
          fullWidth
          placeholder="Aa"
          variant="outlined"
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleMessageSend();
            }
          }}
          disabled={disabled}
          sx={{
            '& .MuiOutlinedInput-root': {
              height: '35px',
              backgroundColor: 'transparent',
              color: 'white',
              '& fieldset': {
                border: 'none',
              },
            },
            '& .MuiInputBase-input': {
              color: 'white',
              padding: '8px 14px',
            }
          }}
        />
        
        <IconButton
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          disabled={disabled}
          sx={{
            color: 'white',
            width: 35,
            height: 35,
            marginRight: '4px',
            opacity: 0.5,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              opacity: 0.9
            }
          }}
        >
          <FontAwesomeIcon icon={faFaceSmile} />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        onClick={handleMessageSend}
        disabled={inputMessage.trim().length === 0 || disabled}
        sx={{
          height: '35px',
          minWidth: 'auto',
          px: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </Button>
    </Box>
  );
}
