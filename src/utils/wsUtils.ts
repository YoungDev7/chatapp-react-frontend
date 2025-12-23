export function getChatViewWSDestination(chatviewId: string, userUid: string): string {
    // return `/topic/chatview.${chatviewId}.user.${userUid}`;
    return '/user/queue/chatview/' + chatviewId;
}
