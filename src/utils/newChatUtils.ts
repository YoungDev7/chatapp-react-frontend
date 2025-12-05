import api from '../services/Api';
import { type User } from './userUtils';

/**
 * Create a new chat with the given title and users
 * @param title - The title of the chat
 * @param users - Array of users to add to the chat
 * @returns The ID of the newly created chat
 */
export const createChat = async (title: string, users: User[] = []): Promise<number> => {
  const userUids = users.map(user => user.uid);
  const response = await api.post('/chatviews', { 
    name: title, 
    userUids: userUids 
  });
  return response.data.id;
};

/**
 * Add a user to a chat
 * @param chatId - The ID of the chat
 * @param userId - The UID of the user to add
 */
export const addUserToChat = async (chatId: number, userId: string): Promise<void> => {
  await api.post(`/chatviews/${chatId}/users/${userId}`);
};

/**
 * Add multiple users to a chat
 * @param chatId - The ID of the chat
 * @param users - Array of users to add
 */
export const addUsersToChat = async (chatId: number, users: User[]): Promise<void> => {
  await Promise.all(
    users.map(user => addUserToChat(chatId, user.uid))
  );
};
