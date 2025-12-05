import api from '../services/Api';

export interface User {
  uid: string;
  name: string;
  email: string;
  avatarLink?: string;
}

/**
 * Search for a user by username or email
 * @param query - The search query (username or email)
 * @returns The found user or null if not found
 * @throws Error if the search fails for reasons other than user not found
 */
export const searchUser = async (query: string): Promise<User | null> => {
  if (!query.trim()) {
    return null;
  }

  try {
    const response = await api.get(`/user/search/${encodeURIComponent(query)}`);
    return response.data;
  } catch (err: unknown) {
    // User not found is expected behavior, return null
    const axiosError = err as { response?: { status?: number; data?: string } };
    if (axiosError?.response?.status === 400 && axiosError?.response?.data?.includes('not found')) {
      return null;
    }
    // Re-throw for actual errors
    throw err;
  }
};
