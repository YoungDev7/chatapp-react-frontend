/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import '../../style/ChatMessage.css';

type Props = {
  sender: string;
  text: string;
  isUser: boolean;
}

export default function ChatMessage({sender, text, isUser}: Props) {

  return (
    <div className={`messageContainer ${isUser ? 'usersMessageContainer' : 'othersMessageContainer'}`}>
      <div className="senderName">{sender}</div>
      <div className="message">{text}</div>
    </div>
  )

}
