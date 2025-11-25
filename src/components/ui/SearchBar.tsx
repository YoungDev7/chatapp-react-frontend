import { TextField, InputAdornment, IconButton } from '@mui/material';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type Props = {
  value: string;
  onChange: (value: string) => void;
}

/**
 * SearchBar component for filtering chats.
 * 
 * Provides a search input field with a search icon.
 * Filters chats by group title or username.
 * 
 * @returns {React.ReactElement} Search bar component
 */
export default function SearchBar({ value, onChange }: Props): React.ReactElement {
  return (
    <TextField
      fullWidth
      placeholder="Search chats..."
      variant="outlined"
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon 
              icon={faMagnifyingGlass} 
              style={{ color: 'rgba(255, 255, 255, 0.5)' }} 
            />
          </InputAdornment>
        ),
        endAdornment: value && (
          <InputAdornment position="end">
            <IconButton
              onClick={() => onChange('')}
              edge="end"
              size="small"
              sx={{ 
                color: 'rgba(255, 255, 255, 0.5)',
                '&:hover': {
                  color: 'rgba(255, 255, 255, 0.8)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.4)',
          },
        },
        '& .MuiInputBase-input::placeholder': {
          color: 'rgba(255, 255, 255, 0.5)',
          opacity: 1,
        },
      }}
    />
  );
}
