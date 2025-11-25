/**
 * Check if message contains only emojis (max 3)
 * @param text - The text to check
 * @returns True if the text contains only 1-3 emojis and no other characters
 */
export function isEmojiOnly(text: string): boolean {
  const trimmed = text.trim();
  
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)(\p{Emoji_Modifier}|\u200D(\p{Emoji_Presentation}|\p{Emoji}\uFE0F))*/gu;
  
  const emojis = trimmed.match(emojiRegex);
  
  if (!emojis || emojis.length === 0 || emojis.length > 3) {
    return false;
  }
  
  const textWithoutEmojis = trimmed.replace(emojiRegex, '').replace(/\s+/g, '');
  
  return textWithoutEmojis.length === 0;
}
