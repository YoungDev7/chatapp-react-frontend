export type Message = {
  text: string;
  senderName: string;
}

export type MessageContainerProps = {
  messages: Message[];
}
