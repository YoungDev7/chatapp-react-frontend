import type { Message } from './message';

export type ChatView = {
  viewId: string;
  title: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}