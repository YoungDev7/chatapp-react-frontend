import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Typography
} from '@mui/material';
import { type ReactNode } from 'react';

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * BaseModal component - reusable modal template.
 * 
 * @param {BaseModalProps} props - Component props
 * @param {boolean} props.open - Whether the modal is open
 * @param {function} props.onClose - Callback function when modal is closed
 * @param {string} props.title - Modal title
 * @param {ReactNode} props.children - Modal content
 * @param {string} props.maxWidth - Maximum width of the modal
 * @returns {React.ReactElement} Base modal
 */
export default function BaseModal({ open, onClose, title, children, maxWidth = 'sm' }: BaseModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
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
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
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
        {children}
      </DialogContent>
    </Dialog>
  );
}
