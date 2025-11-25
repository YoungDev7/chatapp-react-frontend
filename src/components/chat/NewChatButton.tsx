import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';

interface NewChatButtonProps {
  onClick?: () => void;
}

/**
 * NewChatButton component for creating a new chat.
 * 
 * @param {NewChatButtonProps} props - Component props
 * @param {function} props.onClick - Callback function when button is clicked
 * @returns {React.ReactElement} New chat button
 */
export default function NewChatButton({ onClick }: NewChatButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="contained"
      sx={{
        minWidth: 'auto',
        px: 2,
        whiteSpace: 'nowrap'
      }}
    >
      <FontAwesomeIcon icon={faPlus} />
    </Button>
  );
}
