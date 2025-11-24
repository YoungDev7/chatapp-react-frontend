export type Message = {
  text: string;
  senderName: string;
  createdAt?: string | number; // ISO 8601 string or Unix timestamp in seconds (optional for old messages)
}

export type MessageContainerProps = {
  messages: Message[];
}
