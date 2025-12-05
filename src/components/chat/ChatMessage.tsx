import { Avatar } from '@mui/material';
import '../../style/ChatMessage.css';
import type { ChatMessageProps } from '../../types/chatMessageProps';
import { getAvatarColor, getAvatarInitial } from '../../utils/avatarUtils';
import { isEmojiOnly } from '../../utils/emojiUtils';
import { formatMessageTimestamp } from '../../utils/timestampUtils';


export default function ChatMessage({sender, senderAvatarLink, text, isUser, showSender, showAvatar, timestamp, showTimestamp}: ChatMessageProps) {
  const isEmojiOnlyMessage = isEmojiOnly(text);
  
  //todo: finish implementing avatar display

  return (
    <div className={`message ${isUser ? 'usersMessage' : 'othersMessage'} ${!showSender ? 'groupedMessage' : ''}`}>
      <div className="messageRow">
        {!isUser && (
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              fontSize: '14px',
              backgroundColor: getAvatarColor(sender),
              marginRight: '8px',
              alignSelf: 'flex-end',
              visibility: showAvatar ? 'visible' : 'hidden'
            }}
          >
            {getAvatarInitial(sender)}
          </Avatar>
        )}
        <div className="messageContent">
          {showSender && <div className="senderName">{isUser ? 'you' : sender}</div>}
          <div className={`messageText ${isEmojiOnlyMessage ? 'emojiOnly' : ''}`}>{text}</div>
          {showTimestamp && timestamp && (
            <div className="messageTimestamp">{formatMessageTimestamp(timestamp)}</div>
          )}
        </div>
      </div>
    </div>
  )

}
