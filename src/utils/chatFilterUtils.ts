import type { ChatView } from '../types/chatView';

/**
 * Deduplicates chats by viewId, keeping the first occurrence
 */
function deduplicateChats(chats: ChatView[]): ChatView[] {
  const seenIds = new Set<string>();
  return chats.filter(chat => {
    if (seenIds.has(chat.viewId)) {
      return false;
    }
    seenIds.add(chat.viewId);
    return true;
  });
}

/**
 * Filters chats by search query
 */
function filterChatsBySearchQuery(chats: ChatView[], searchQuery: string): ChatView[] {
  if (!searchQuery.trim()) {
    return chats;
  }
  return chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
}

/**
 * Gets the timestamp of the latest message in a chat
 */
function getLatestMessageTime(messages: ChatView['messages']): number {
  if (!messages || messages.length === 0) return 0;
  const latestMessage = messages[messages.length - 1];
  return new Date(latestMessage.createdAt).getTime();
}

/**
 * Sorts chats by newest first (most recent message)
 */
function sortChatsByNewest(chats: ChatView[]): ChatView[] {
  return [...chats].sort((a, b) => {
    const timeA = getLatestMessageTime(a.messages);
    const timeB = getLatestMessageTime(b.messages);
    return timeB - timeA;
  });
}

/**
 * Filters and sorts chats based on search query and by newest first
 * @param chatViewCollection - Array of all chats
 * @param searchQuery - Search query string to filter chats
 * @returns Filtered, deduplicated, and sorted array of chats
 */
export function getFilteredAndSortedChats(
  chatViewCollection: ChatView[],
  searchQuery: string
): ChatView[] {
  let chats = deduplicateChats(chatViewCollection);
  chats = filterChatsBySearchQuery(chats, searchQuery);
  chats = sortChatsByNewest(chats);
  return chats;
}
