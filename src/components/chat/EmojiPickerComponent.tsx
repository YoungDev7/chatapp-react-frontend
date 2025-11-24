import { Box } from '@mui/material';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';
import type { RefObject } from 'react';

interface EmojiPickerComponentProps {
  onEmojiClick: (emojiData: { emoji: string }) => void;
  emojiPickerRef: RefObject<HTMLDivElement | null>;
}

export default function EmojiPickerComponent({ onEmojiClick, emojiPickerRef }: EmojiPickerComponentProps) {
  return (
    <Box
      ref={emojiPickerRef}
      sx={{
        position: 'absolute',
        bottom: '50px',
        left: '10px',
        zIndex: 1000
      }}
    >
      <EmojiPicker 
        onEmojiClick={onEmojiClick} 
        theme={Theme.DARK}
        emojiStyle={EmojiStyle.FACEBOOK}
        searchPlaceholder="Search emoji..."
        previewConfig={{
          showPreview: false
        }}
        skinTonesDisabled={true}
        autoFocusSearch={true}
        lazyLoadEmojis={true}
      />
    </Box>
  );
}
