import type { Message } from './message';

export type ChatView = {
  id: string;
  title: string;
  messages: Message[];
  isLoading: boolean;
  userCount: number;
  error: string | null;
  unreadCount?: number;
}