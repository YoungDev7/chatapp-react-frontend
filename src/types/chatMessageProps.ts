export type ChatMessageProps = {
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