import type { Message } from './message';

export type ChatView = {
  id: string;
  title: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  unreadCount?: number;
}