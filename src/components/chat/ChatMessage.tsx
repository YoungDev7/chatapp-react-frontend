import { Avatar } from '@mui/material';
import '../../style/ChatMessage.css';
import { getAvatarColor, getAvatarInitial } from '../../utils/avatarUtils';
import { isEmojiOnly } from '../../utils/emojiUtils';
import { formatMessageTimestamp } from '../../utils/timestampUtils';

interface ChatMessageProps {
  sender: string;
  senderUid: string;
  senderAvatarLink: string;
  text: string;
  isUser: boolean;
  showSender: boolean;
  showAvatar: boolean;
  timestamp?: string | number;
  showTimestamp?: boolean;
}

export default function ChatMessage({ sender, senderAvatarLink, text, isUser, showSender, showAvatar, timestamp, showTimestamp }: ChatMessageProps) {
  const isEmojiOnlyMessage = isEmojiOnly(text);

  return (
    <div className={`message ${isUser ? 'usersMessage' : 'othersMessage'} ${!showSender ? 'groupedMessage' : ''}`}>
      <div className="messageRow">
        {!isUser && (
          <Avatar
            className="messageAvatar"
            src={senderAvatarLink || undefined}
            alt={sender}
            sx={{
              width: 40,
              height: 40,
              fontSize: '12px',
              backgroundColor: getAvatarColor(sender),
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
