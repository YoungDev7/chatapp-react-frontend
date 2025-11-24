import { faBars, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, IconButton } from '@mui/material';

interface ChatHeaderProps {
  title: string;
  isMobile?: boolean;
  onMenuClick?: () => void;
}

/**
 * ChatHeader component that displays the chat title bar.
 * 
 * @param {ChatHeaderProps} props - Component props
 * @param {string} props.title - The title to display in the header
 * @param {boolean} props.isMobile - Whether the view is mobile
 * @param {function} props.onMenuClick - Callback function when menu button is clicked
 * @returns {React.ReactElement} Chat header interface
 */
export default function ChatHeader({ title, isMobile = false, onMenuClick }: ChatHeaderProps) {
  return (
    <Box
      sx={{ 
        height: '55px',
        backgroundColor: (theme) => theme.palette.custom.secondaryDark,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        gap: 1.5,
        flexShrink: 0,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        zIndex: 2,
        boxShadow: '0 6px 24px -2px rgba(0,0,0,0.28)'
      }}
    >
      {isMobile && onMenuClick && (
        <IconButton
          onClick={onMenuClick}
          sx={{
            color: 'white',
            width: 36,
            height: 36,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <FontAwesomeIcon icon={faBars} />
        </IconButton>
      )}
      <FontAwesomeIcon icon={faUsers} size="lg" />
      <Box sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
        {title}
      </Box>
    </Box>
  );
}
