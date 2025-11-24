/**
 * Formats a timestamp for message display based on when it was sent
 * Automatically converts ISO 8601 timestamp to client's local timezone
 * 
 * Rules:
 * - Today: "HH:MM" (e.g., "14:30")
 * - Different day (same year): "MMM DD, HH:MM" (e.g., "Nov 24, 14:30")
 * - Different year: "MMM DD, YYYY HH:MM" (e.g., "Nov 24, 2024 14:30")
 * 
 * @param timestamp - ISO 8601 timestamp string, Unix timestamp (seconds), or Date object
 * @returns Formatted timestamp string in client's local timezone
 */
export function formatMessageTimestamp(timestamp: string | number | Date | null | undefined): string {
  if (!timestamp) {
    return '';
  }
  
  try {
    let messageDate: Date;
    
    // Handle different timestamp formats
    if (typeof timestamp === 'number') {
      // Unix timestamp in seconds (multiply by 1000 for milliseconds)
      messageDate = new Date(timestamp * 1000);
    } else if (typeof timestamp === 'string') {
      // ISO 8601 string - Date constructor handles timezone conversion
      messageDate = new Date(timestamp);
    } else {
      // Already a Date object
      messageDate = timestamp;
    }
    
    // Check if date is valid
    if (!messageDate || isNaN(messageDate.getTime())) {
      return '';
    }
    
    // Now in client's local timezone
    const now = new Date();
    
    const isToday = 
      messageDate.getDate() === now.getDate() &&
      messageDate.getMonth() === now.getMonth() &&
      messageDate.getFullYear() === now.getFullYear();
    
    const isSameYear = messageDate.getFullYear() === now.getFullYear();
    
    // Get hours and minutes in client's local timezone
    const hours = messageDate.getHours().toString().padStart(2, '0');
    const minutes = messageDate.getMinutes().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}`;
    
    if (isToday) {
      return timeStr;
    }
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[messageDate.getMonth()];
    const day = messageDate.getDate();
    
    if (isSameYear) {
      return `${month} ${day}, ${timeStr}`;
    }
    
    const year = messageDate.getFullYear();
    return `${month} ${day}, ${year} ${timeStr}`;
  } catch (error) {
    console.error('Error formatting timestamp:', error, timestamp);
    return '';
  }
}

/**
 * Checks if two timestamps are within one minute of each other
 * Handles ISO 8601 timestamps with timezone information and Unix timestamps
 * 
 * @param timestamp1 - First timestamp (ISO 8601 string, Unix seconds, or Date)
 * @param timestamp2 - Second timestamp (ISO 8601 string, Unix seconds, or Date)
 * @returns true if timestamps are within 1 minute
 */
export function isWithinOneMinute(
  timestamp1: string | number | Date | null | undefined, 
  timestamp2: string | number | Date | null | undefined
): boolean {
  // Check for null/undefined before processing
  if (!timestamp1 || !timestamp2) {
    return false;
  }
  
  try {
    let date1: Date;
    let date2: Date;
    
    if (typeof timestamp1 === 'number') {
      date1 = new Date(timestamp1 * 1000); 
    } else if (typeof timestamp1 === 'string') {
      date1 = new Date(timestamp1); 
    } else {
      date1 = timestamp1; 
    }
    
    if (typeof timestamp2 === 'number') {
      date2 = new Date(timestamp2 * 1000); 
    } else if (typeof timestamp2 === 'string') {
      date2 = new Date(timestamp2);
    } else {
      date2 = timestamp2; 
    }
    
    if (!date1 || !date2 || isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      return false;
    }
    
    const diffMs = Math.abs(date1.getTime() - date2.getTime());
    const oneMinuteMs = 60 * 1000;
    
    return diffMs < oneMinuteMs;
  } catch (error) {
    console.error('Error comparing timestamps:', error, timestamp1, timestamp2);
    return false;
  }
}

/**
 * Determines if a timestamp should be shown for a message
 * Shows timestamp only if:
 * - It's the first message
 * - The previous message is from a different sender
 * - More than 1 minute has passed since the previous message
 * 
 * @param currentTimestamp - Current message timestamp (ISO 8601 string, Unix seconds, or Date)
 * @param previousTimestamp - Previous message timestamp (optional)
 * @param currentSender - Current message sender
 * @param previousSender - Previous message sender (optional)
 * @returns true if timestamp should be displayed
 */
export function shouldShowTimestamp(
  currentTimestamp: string | number | Date,
  previousTimestamp: string | number | Date | null,
  currentSender: string,
  previousSender: string | null
): boolean {
    // Always show for first message
  if (!previousTimestamp || !previousSender) {
    return true;
  }
  
  // Show if different sender
  if (currentSender !== previousSender) {
    return true;
  }
  
  // Show if more than 1 minute has passed
  return !isWithinOneMinute(currentTimestamp, previousTimestamp);
}
