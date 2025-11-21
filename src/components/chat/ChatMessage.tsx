import '../../style/ChatMessage.css';
import type { ChatMessageProps } from '../../types/chatMessage';

export default function ChatMessage({sender, text, isUser, showSender}: ChatMessageProps) {

  // todo: add timestamp

  return (
    <div className={`message ${isUser ? 'usersMessage' : 'othersMessage'} ${!showSender ? 'groupedMessage' : ''}`}>
      {showSender && <div className="senderName">{isUser ? 'you' : sender}</div>}
      <div className="messageText">{text}</div>
    </div>
  )

}
