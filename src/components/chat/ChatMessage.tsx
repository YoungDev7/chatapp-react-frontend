import '../../style/ChatMessage.css';
import type { ChatMessageProps } from '../../types/chatMessage';
import { formatMessageTimestamp } from '../../utils/timestampUtils';

export default function ChatMessage({sender, text, isUser, showSender, timestamp, showTimestamp}: ChatMessageProps) {

  return (
    <div className={`message ${isUser ? 'usersMessage' : 'othersMessage'} ${!showSender ? 'groupedMessage' : ''}`}>
      {showSender && <div className="senderName">{isUser ? 'you' : sender}</div>}
      <div className="messageText">{text}</div>
      {showTimestamp && timestamp && (
        <div className="messageTimestamp">{formatMessageTimestamp(timestamp)}</div>
      )}
    </div>
  )

}
