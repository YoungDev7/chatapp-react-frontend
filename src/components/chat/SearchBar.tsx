import { TextField, InputAdornment } from '@mui/material';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

/**
 * SearchBar component for filtering chats.
 * 
 * Provides a search input field with a search icon.
 * Currently static, will be connected to search functionality later.
 * 
 * @returns {React.ReactElement} Search bar component
 */
export default function SearchBar(): React.ReactElement {
  return (
    <TextField
      fullWidth
      placeholder="Search chats..."
      variant="outlined"
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <FontAwesomeIcon 
              icon={faMagnifyingGlass} 
              style={{ color: 'rgba(255, 255, 255, 0.5)' }} 
            />
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
