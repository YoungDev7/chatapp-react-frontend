# Chat Application - Development Summary

## Overview
This document provides a comprehensive summary of all changes made to the React frontend of the chat application. Special emphasis is placed on the **Avatar System** architecture and data flow.

---

## Table of Contents
1. [Core Architecture Changes](#core-architecture-changes)
2. [Avatar System Deep Dive](#avatar-system-deep-dive)
3. [WebSocket Subscription Management](#websocket-subscription-management)
4. [Redux State Management](#redux-state-management)
5. [Component Refactoring](#component-refactoring)
6. [Type System Improvements](#type-system-improvements)
7. [Known Issues & TODOs](#known-issues--todos)

---

## Core Architecture Changes

### Application Initialization Flow
The app now uses a new **InitializationHandler** component that orchestrates the startup sequence:

```tsx
// App.tsx - New component hierarchy
<AuthHandler>
  <ProtectedRoute>
    <InitializationHandler>     {/* NEW - loads chat views & avatars */}
      <WebSocketHandler>         {/* Manages subscriptions */}
        <Layout>
          <ChatView />
        </Layout>
      </WebSocketHandler>
    </InitializationHandler>
  </ProtectedRoute>
</AuthHandler>
```

### Strict Mode Disabled
```tsx
// main.tsx
// StrictMode is commented out to prevent double-rendering effects
// which was causing duplicate WebSocket subscriptions
```

---

## Avatar System Deep Dive

### 🎯 **CRITICAL: Avatar Flow (Currently Incomplete)**

The avatar system is **partially implemented** and requires completion. Here's the current architecture:

### 1. Avatar Data Fetching (✅ WORKING)

**Location**: `InitializationHandler.tsx`

```tsx
useEffect(() => {
  const initializeChatViews = async () => {
    // Fetch all chat views from backend
    const result = await dispatch(fetchChatViews()).unwrap();

    result.forEach((chatView: { 
      id: string; 
      name: string,
      messageCount: number, 
      userAvatars: Record<string, string>  // 👈 AVATAR DATA ARRIVES HERE
    }) => {
      // Store chat view with messages
      dispatch(addChatView({
        id: chatView.id,
        title: chatView.name,
        messages: parsedStoredmessages,
      }));

      // 👇 AVATAR DISPATCH - Store user avatars in Redux Map
      if (chatView.userAvatars) {
        dispatch(addUserAvatars(chatView.userAvatars));
      }
    });
  };
}, [dispatch]);
```

**Data Structure from Backend:**
```json
{
  "id": "1",
  "name": "Global Chat",
  "messageCount": 42,
  "userAvatars": {
    "user-123": "https://example.com/avatars/user123.jpg",
    "user-456": "https://example.com/avatars/user456.jpg"
  }
}
```

### 2. Avatar Storage in Redux (✅ WORKING)

**Location**: `store/slices/chatViewSlice.ts`

The avatars are stored in a **Map** for efficient O(1) lookups:

```tsx
type ChatViewState = {
  chatViewCollection: ChatView[],
  isLoadingChatViews: boolean,
  currentlyDisplayedChatView: string,
  userAvatars: Map<string, string>,  // 👈 Map<userId, avatarUrl>
  error: string | null
}

const chatViewSlice = createSlice({
  name: 'chatView',
  initialState: {
    userAvatars: new Map<string, string>(),
    // ... other state
  },
  reducers: {
    // 👇 ACTION: Add avatars from backend response
    addUserAvatars: (state, action) => {
      const userAvatarsObj = action.payload; // { userId: url, userId2: url2 }
      Object.entries(userAvatarsObj).forEach(([userId, avatarUrl]) => {
        state.userAvatars.set(userId, avatarUrl as string);
      });          
    }
  }
});

// 👇 SELECTORS: Access avatar data
export const selectUserAvatar = (
  state: { chatView: ChatViewState }, 
  userId: string
): string | undefined => {
  return state.chatView.userAvatars.get(userId);
};

export const selectAllUserAvatars = (
  state: { chatView: ChatViewState }
): Array<[string, string]> => {
  return Array.from(state.chatView.userAvatars.entries());
};
```

**Redux Store Configuration:**
```tsx
// store/store.ts
import { enableMapSet } from 'immer';

// 👇 CRITICAL: Enable Map/Set support in Redux
enableMapSet();

export const store = configureStore({
  reducer: { /* ... */ },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 👇 Ignore Map serialization warnings
        ignoredPaths: ['chatView.userAvatars'],
      },
    }),
});
```

### 3. Avatar Retrieval in Components (✅ WORKING)

**Location**: `components/chat/MessageContainer.tsx`

```tsx
const MessageContainer = ({ messages }: MessageContainerProps) => {
  const { user } = useAppSelector(state => state.auth); 
  
  // 👇 Get the entire avatars Map from Redux
  const userAvatars = useAppSelector(state => state.chatView.userAvatars);

  return (
    <Box>
      {messages.map((message, index) => {
        // 👇 Look up avatar URL for this message sender
        const senderAvatarLink = userAvatars.get(message.senderUid) || '';
        
        return (
          <ChatMessage 
            sender={message.senderName} 
            senderUid={message.senderUid}
            senderAvatarLink={senderAvatarLink}  // 👈 Pass to child
            // ... other props
          />
        );
      })}
    </Box>
  );
};
```

### 4. Avatar Display in ChatMessage (❌ NOT IMPLEMENTED)

**Location**: `components/chat/ChatMessage.tsx`

```tsx
export default function ChatMessage({
  sender, 
  senderAvatarLink,  // 👈 Receives avatar URL
  text, 
  isUser, 
  showAvatar
}: ChatMessageProps) {
  
  //❌ TODO: finish implementing avatar display
  
  return (
    <div className="messageRow">
      {!isUser && (
        <Avatar 
          sx={{ 
            width: 32, 
            height: 32,
            // 👇 Currently uses color-based fallback
            backgroundColor: getAvatarColor(sender),
            visibility: showAvatar ? 'visible' : 'hidden'
          }}
        >
          {/* 👇 Shows initial letter, should show image if URL exists */}
          {getAvatarInitial(sender)}
        </Avatar>
      )}
      {/* ... message content */}
    </div>
  );
}
```

### 🔧 **What Needs to Be Done:**

Replace the avatar display logic to use the `senderAvatarLink`:

```tsx
// ❌ CURRENT CODE:
<Avatar sx={{ backgroundColor: getAvatarColor(sender) }}>
  {getAvatarInitial(sender)}
</Avatar>

// ✅ SHOULD BE:
<Avatar 
  src={senderAvatarLink}  // 👈 Use URL if available
  sx={{ 
    backgroundColor: senderAvatarLink ? 'transparent' : getAvatarColor(sender)
  }}
>
  {!senderAvatarLink && getAvatarInitial(sender)}
</Avatar>
```

### Avatar System Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    AVATAR DATA FLOW                          │
└─────────────────────────────────────────────────────────────┘

1. Backend API Response
   └─> { userAvatars: { "userId": "url" } }

2. InitializationHandler.tsx
   └─> dispatch(addUserAvatars(chatView.userAvatars))

3. Redux Store (chatViewSlice)
   └─> Map<string, string> userAvatars.set(userId, url)

4. MessageContainer.tsx
   └─> const userAvatars = useAppSelector(...)
   └─> const senderAvatarLink = userAvatars.get(message.senderUid)

5. ChatMessage.tsx
   └─> receives senderAvatarLink prop
   └─> ❌ NOT YET USED IN <Avatar /> COMPONENT
```

---

## WebSocket Subscription Management

### Centralized Subscription Architecture

All WebSocket subscriptions are now managed centrally in `WebSocketHandler.tsx`:

```tsx
export default function WebSocketHandler({ children }: { children: ReactNode }) {
  const { stompClient, connectionStatus } = useAppSelector(state => state.ws);
  const { chatViewCollection } = useAppSelector(state => state.chatView);
  
  // 👇 Track subscriptions to prevent race conditions
  const subscribedViewsRef = useRef<Set<string>>(new Set());
  const failedSubscriptionsRef = useRef<Map<string, number>>(new Map());
  const MAX_RETRY_ATTEMPTS = 3;

  // Effect 1: Connect to WebSocket
  useEffect(() => {
    if (!token || isLoadingChatViews) return;
    
    const client = new Client({
      webSocketFactory: () => new SockJS(
        `${env.VITE_WS_BASE_URL}?token=Bearer ${encodeURIComponent(token)}`
      ),
      connectHeaders: { Authorization: `Bearer ${token}` },
    });

    client.onConnect = () => {
      dispatch(setConnectionStatus('connected'));
      dispatch(setStompClient(client));
    };

    client.activate();

    return () => {
      dispatch(clearAllSubscriptions());
      client.deactivate();
      subscribedViewsRef.current.clear();
      failedSubscriptionsRef.current.clear();
    };
  }, [token, isLoadingChatViews]);

  // Effect 2: Subscribe to all chat views
  useEffect(() => {
    if (stompClient && connectionStatus === 'connected') {
      chatViewCollection.forEach(chatView => {
        // 👇 Prevent duplicate subscriptions
        if (subscribedViewsRef.current.has(chatView.id)) return;
        
        // 👇 Prevent infinite retry loops
        const failCount = failedSubscriptionsRef.current.get(chatView.id) || 0;
        if (failCount >= MAX_RETRY_ATTEMPTS) {
          console.warn(`Skipping ${chatView.id} - max retries reached`);
          return;
        }
        
        const destination = `/topic/chatview.${chatView.id}.user.${user.uid}`;
        
        try {
          const subscription = stompClient.subscribe(destination, (message) => {
            const newMessage = JSON.parse(message.body);
            dispatch(addMessage({ id: chatView.id, message: newMessage }));
          });
          
          // 👇 Mark as subscribed immediately
          subscribedViewsRef.current.add(chatView.id);
          failedSubscriptionsRef.current.delete(chatView.id);
          dispatch(addSubscription({ id: chatView.id, subscription }));
        } catch (error) {
          failedSubscriptionsRef.current.set(chatView.id, failCount + 1);
        }
      });
    }
    
    // 👇 Clear tracking on disconnect for fresh retry
    if (connectionStatus !== 'connected') {
      subscribedViewsRef.current.clear();
      failedSubscriptionsRef.current.clear();
    }
  }, [stompClient, connectionStatus, chatViewCollection, user.uid]);

  return children;
}
```

### Key Features:

1. **Race Condition Prevention**: `subscribedViewsRef` tracks subscriptions synchronously
2. **Automatic Retry**: Failed subscriptions retry up to 3 times
3. **Global Persistence**: Subscriptions persist when switching views
4. **Auto-subscribe**: New chat views are automatically subscribed
5. **Clean Disconnection**: Unsubscribes all on disconnect

### ChatView Simplification

`ChatView.tsx` no longer manages subscriptions:

```tsx
// ❌ REMOVED: Per-view subscription logic
// useEffect(() => {
//   const subscription = stompClient.subscribe(...);
//   return () => subscription.unsubscribe();
// }, [id]);

// ✅ NOW: Just sends messages
export default function ChatView({ id }: ChatViewProps) {
  const { stompClient } = useAppSelector(state => state.ws);
  const chatView = useAppSelector(
    state => state.chatView.chatViewCollection.find(view => view.id === id)
  );

  function handleMessageSend(message: string) {
    if (stompClient) {
      stompClient.publish({
        destination: `/app/chatview/${id}`,
        body: JSON.stringify({ text: message, createdAt: new Date().toISOString() })
      });
    }
  }

  return <Box>{ /* UI */ }</Box>;
}
```

---

## Redux State Management

### Authentication Slice Changes

```tsx
// authSlice.ts

// ❌ REMOVED: localStorage user persistence
// localStorage.setItem('user', JSON.stringify(state.user));

// ✅ NOW: User data extracted from JWT only
const parseJWT = (token: string) => {
  const base64Payload = token.split('.')[1];
  const payload = JSON.parse(atob(base64Payload));
  return {
    email: payload.sub,
    name: payload.name,
    uid: payload.uid  // 👈 Used for WebSocket subscriptions
  };
};
```

### WebSocket Slice (NEW)

```tsx
// slices/wsSlice.ts
export const wsSlice = createSlice({
  name: 'ws',
  initialState: {
    stompClient: null as Client | null,
    connectionStatus: 'disconnected',
    subscriptions: new Map<string, StompSubscription>(),  // 👈 Track all subs
  },
  reducers: {
    addSubscription: (state, action) => {
      const { id, subscription } = action.payload;
      state.subscriptions.set(id, subscription);
    },
    clearAllSubscriptions: (state) => {
      state.subscriptions.forEach(sub => sub.unsubscribe());
      state.subscriptions.clear();
    },
  },
});
```

### Chat View Slice Refactoring

```tsx
// chatViewSlice.ts

type ChatViewState = {
  chatViewCollection: ChatView[],       // Array of all chat views
  isLoadingChatViews: boolean,          // Global loading state
  currentlyDisplayedChatView: string,   // Active view ID
  userAvatars: Map<string, string>,     // 👈 NEW: Avatar storage
  error: string | null
}

// ✅ NEW: Support multiple chat views
reducers: {
  setMessages: (state, action) => {
    const { id, messages } = action.payload;
    const view = state.chatViewCollection.find(v => v.id === id);
    if (view) {
      view.messages = messages;
      localStorage.setItem(`messages_${id}`, JSON.stringify(messages));
    }
  },
  
  addMessage: (state, action) => {
    const { id, message } = action.payload;
    const view = state.chatViewCollection.find(v => v.id === id);
    if (view) {
      view.messages.push(message);
      localStorage.setItem(`messages_${id}`, JSON.stringify(view.messages));
    }
  },
  
  addChatView: (state, action) => {
    state.chatViewCollection.push({
      id: action.payload.id,
      title: action.payload.title,
      messages: action.payload.messages,
      isLoading: false,
      error: null
    });
  },
  
  // 👇 NEW: Avatar management
  addUserAvatars: (state, action) => {
    const userAvatarsObj = action.payload;
    Object.entries(userAvatarsObj).forEach(([userId, avatarUrl]) => {
      state.userAvatars.set(userId, avatarUrl as string);
    });
  }
}

// ✅ NEW: Async thunks for message fetching
export const fetchAllMessages = createAsyncThunk(
  'chatView/fetchAllMessages',
  async (chatViewId: string) => {
    const response = await api.get(`/chatviews/${chatViewId}/messages`);
    return { chatViewId, messages: response.data };
  }
);

export const fetchMessagesFromQueue = createAsyncThunk(
  'chatView/fetchMessagesFromQueue',
  async (chatViewId: string) => {
    const response = await api.get(`/chatviews/${chatViewId}/messages/queue`);
    return { chatViewId, messages: response.data };
  }
);

export const fetchChatViews = createAsyncThunk(
  'chatView/fetchChatViews',
  async () => {
    const response = await api.get('/chatviews');
    return response.data;
  }
);
```

---

## Component Refactoring

### New Components

#### 1. InitializationHandler (NEW)
**Purpose**: Orchestrates app startup - loads chat views, messages, and avatars

```tsx
// InitializationHandler.tsx
export default function InitializationHandler({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeChatViews = async () => {
      // 1. Fetch all chat views from backend
      const result = await dispatch(fetchChatViews()).unwrap();

      result.forEach((chatView) => {
        // 2. Check localStorage for cached messages
        const storedMessages = localStorage.getItem(`messages_${chatView.id}`);
        const parsedStoredmessages = storedMessages ? JSON.parse(storedMessages) : [];

        // 3. Add chat view to Redux
        dispatch(addChatView({
          id: chatView.id,
          title: chatView.name,
          messages: parsedStoredmessages,
        }));

        // 4. 👈 CRITICAL: Dispatch user avatars
        if (chatView.userAvatars) {
          dispatch(addUserAvatars(chatView.userAvatars));
        }

        // 5. Determine if we need to fetch messages
        if (parsedStoredmessages.length === 0 && chatView.messageCount > 0) {
          // No cached messages - fetch all
          dispatch(fetchAllMessages(chatView.id));
        } else if (parsedStoredmessages.length !== chatView.messageCount) {
          // Cached messages out of sync - fetch new ones
          dispatch(fetchMessagesFromQueue(chatView.id));
        }
      });
      
      dispatch(setIsLoadingChatViews(false));
    };

    initializeChatViews();
  }, [dispatch]);

  return children;
}
```

#### 2. SidebarItem (NEW)
**Purpose**: Individual chat view list item with loading state

```tsx
// sidebar/SidebarItem.tsx
export default function SidebarItem({ id, title, isLoading }: SidebarItemProps) {
  const dispatch = useAppDispatch();
  const { currentlyDisplayedChatView } = useAppSelector(state => state.chatView);
  const isActive = currentlyDisplayedChatView === id;
  
  return (
    <ListItemButton 
      onClick={() => dispatch(setCurrentlyDisplayedChatView(id))}
      sx={{ 
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
        border: isActive ? 1 : 0,
        borderColor: isActive ? 'primary.main' : 'transparent',
      }}
    >
      <FontAwesomeIcon icon={faUsers} />
      <ListItemText primary={title} />
      {isLoading && <CircularProgress size={20} />}
    </ListItemButton>
  );
}
```

### Modified Components

#### Sidebar Refactoring

```tsx
// ❌ OLD: Hardcoded single chat view
<List>
  <ListItem><ListItemText primary="Global Chat" /></ListItem>
</List>

// ✅ NEW: Dynamic list from Redux
const { chatViewCollection } = useAppSelector(state => state.chatView);

<List>
  {chatViewCollection.map((chat) => (
    <SidebarItem 
      key={chat.id} 
      id={chat.id} 
      title={chat.title} 
      isLoading={chat.isLoading} 
    />
  ))}
</List>
```

#### ChatView Props

```tsx
// ❌ OLD: No props - assumed single global chat
export default function ChatView() {
  // ...
}

// ✅ NEW: Receives id to display specific chat
export default function ChatView({ id }: ChatViewProps) {
  const chatView = useAppSelector(
    state => state.chatView.chatViewCollection.find(v => v.id === id),
    shallowEqual  // 👈 Performance optimization
  );
  
  return (
    <Box>
      <ChatHeader title={chatView?.title || '{chatview title}'} />
      <MessageContainer messages={chatView?.messages || []} />
      <ChatInput onSendMessage={handleMessageSend} />
    </Box>
  );
}
```

---

## Type System Improvements

### New Type Files Created

```typescript
// types/message.ts
export type Message = {
  text: string;
  senderName: string;
  senderUid: string;      // 👈 NEW: For avatar lookup
  chatViewId: string;
  createdAt: string;
};

// types/chatView.ts
export type ChatView = {
  id: string;
  title: string;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
};

// types/chatViewProps.ts
export type ChatViewProps = {
  id: string;          // 👈 NEW: ChatView now receives id
};

// types/chatMessageProps.ts
export type ChatMessageProps = {
  sender: string;
  senderUid: string;       // 👈 NEW: User ID
  senderAvatarLink: string; // 👈 NEW: Avatar URL
  text: string;
  isUser: boolean;
  showSender: boolean;
  showAvatar: boolean;
  timestamp?: string | number;
  showTimestamp?: boolean;
};

// types/messageContainerProps.ts
export type MessageContainerProps = {
  messages: Message[];
};

// types/sidebarItemProps.ts
export type SidebarItemProps = {
  id: string;
  title: string;
  isLoading: boolean;
};
```

### Type Files Renamed

```
❌ chatMessage.ts     → ✅ chatMessageProps.ts
❌ messageContainer.ts → ✅ messageContainerProps.ts
```

---

## Known Issues & TODOs

### 🔴 Critical - Avatar Display Not Complete

**Location**: `components/chat/ChatMessage.tsx`

**Issue**: Avatar URL is passed but not used in `<Avatar>` component

**Current Code**:
```tsx
<Avatar sx={{ backgroundColor: getAvatarColor(sender) }}>
  {getAvatarInitial(sender)}
</Avatar>
```

**Required Fix**:
```tsx
<Avatar 
  src={senderAvatarLink}
  alt={sender}
  sx={{ 
    backgroundColor: senderAvatarLink ? 'transparent' : getAvatarColor(sender)
  }}
>
  {!senderAvatarLink && getAvatarInitial(sender)}
</Avatar>
```

### 🟡 Medium Priority

1. **New Chat Creation** (`Sidebar.tsx`)
   ```tsx
   const handleCreateChat = (chatName: string) => {
     // TODO: Implement create chat logic
     console.log('Creating chat:', chatName);
   };
   ```

2. **Error Handling UI**
   - No visual feedback when chat view fails to load
   - Subscription errors logged but not shown to user

3. **Loading States**
   - Individual chat view loading shows in sidebar
   - No skeleton loader for message container during fetch

### 🟢 Nice to Have

1. **Avatar Caching**: Implement image caching strategy
2. **Optimistic Updates**: Show sent messages immediately before server confirmation
3. **Retry UI**: Button to manually retry failed subscriptions
4. **Message Pagination**: Currently loads all messages at once

---

## File Structure Changes

### New Files
```
src/
  components/
    InitializationHandler.tsx          # NEW - App initialization
    sidebar/
      Sidebar.tsx                       # MOVED from components/
      SidebarItem.tsx                   # NEW - List item component
  types/
    chatView.ts                         # NEW
    chatViewProps.ts                    # NEW
    message.ts                          # NEW
    chatMessageProps.ts                 # RENAMED from chatMessage.ts
    messageContainerProps.ts            # RENAMED from messageContainer.ts
    sidebarItemProps.ts                 # NEW
```

### Modified Files
```
src/
  App.tsx                               # Added InitializationHandler
  main.tsx                              # Disabled StrictMode
  components/
    Layout.tsx                          # Updated import path
    WebSocketHandler.tsx                # Centralized subscriptions
    chat/
      ChatView.tsx                      # Now receives id prop
      ChatMessage.tsx                   # Added avatar props (not used yet)
      MessageContainer.tsx              # Retrieves avatars from Redux
  store/
    store.ts                            # Enabled Map support
    slices/
      authSlice.ts                      # Removed localStorage user persistence
      chatViewSlice.ts                  # Added userAvatars Map, multi-view support
      wsSlice.ts                        # Added subscriptions Map
```

---

## Backend API Contract

### Expected Endpoints

```
GET /chatviews
Response: [
  {
    "id": "1",
    "name": "Global Chat",
    "messageCount": 42,
    "userAvatars": {              // 👈 CRITICAL for avatar system
      "userId1": "https://...",
      "userId2": "https://..."
    }
  }
]

GET /chatviews/:id/messages
Response: [
  {
    "text": "Hello",
    "senderName": "John",
    "senderUid": "userId1",      // 👈 Must match userAvatars keys
    "chatViewId": "1",
    "createdAt": "2024-01-01T12:00:00Z"
  }
]

GET /chatviews/:id/messages/queue
Response: [ /* Same as above */ ]

WS /topic/chatview.{id}.user.{userId}
Message: {
  "text": "New message",
  "senderName": "Jane",
  "senderUid": "userId2",
  "chatViewId": "1",
  "createdAt": "2024-01-01T12:05:00Z"
}
```

---

## Testing Checklist

- [ ] Avatar URLs correctly fetched from backend
- [ ] Avatars stored in Redux Map
- [ ] Avatar URLs passed to ChatMessage component
- [ ] **Avatar images displayed in messages** ❌ NOT YET IMPLEMENTED
- [ ] Fallback to initials when no avatar URL
- [ ] Multiple chat views load correctly
- [ ] Switching between chat views persists subscriptions
- [ ] New messages appear in correct chat view
- [ ] WebSocket reconnects after disconnect
- [ ] Failed subscriptions retry correctly
- [ ] localStorage message caching works
- [ ] Offline messages sync on reconnect

---

## Performance Considerations

1. **Map vs Object for Avatars**: Using `Map<string, string>` provides O(1) lookups
2. **shallowEqual in ChatView**: Prevents unnecessary re-renders
3. **useRef for Subscriptions**: Synchronous checks prevent race conditions
4. **localStorage Caching**: Reduces API calls on page reload
5. **Immer MapSet Plugin**: Efficient immutable Map updates in Redux

---

## Next Developer Priorities

1. **CRITICAL**: Complete avatar display in `ChatMessage.tsx`
2. Implement new chat creation flow
3. Add error boundaries for failed subscriptions
4. Implement message pagination
5. Add avatar upload functionality
6. Create admin panel for chat view management

---

*Document Last Updated: December 4, 2025*
