export type ChatMessageProps = {
  sender: string;
  text: string;
  isUser: boolean;
  showSender: boolean;
  timestamp?: string | number; // ISO 8601 string or Unix timestamp in seconds
  showTimestamp?: boolean;
}