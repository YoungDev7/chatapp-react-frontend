/**
 * Generates a consistent color for an avatar based on the user's name
 * Uses a hash function to ensure the same name always produces the same color
 * 
 * @param name - The user's name
 * @returns HSL color string
 */
export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 50%)`;
}

/**
 * Gets the first letter of a name in uppercase for avatar display
 * 
 * @param name - The user's name
 * @returns First letter in uppercase
 */
export function getAvatarInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}
