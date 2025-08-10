/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import '../../style/ChatMessage.css'

export default function ChatMessage({sender, text, isUser}) {

    
  return (
    <div className={`messageContainer ${isUser ? 'usersMessageContainer' : 'othersMessageContainer'}`}>
      <div className="senderName">{sender}</div>
      <div className="message">{text}</div>
    </div>
  )

}
