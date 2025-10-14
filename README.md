# Chat Application - Frontend

A real-time chat application frontend built with React, Vite, and Redux Toolkit. Features JWT authentication, WebSocket connections for real-time messaging, and a responsive Bootstrap UI.

## 🚀 Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **Bootstrap 5** - UI framework

## 📋 Features

- User registration and login with JWT authentication
- Real-time messaging via WebSocket/STOMP
- Automatic token refresh
- Protected routes
- Responsive design
- Message history

## 🏗️ Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthHandler.jsx      # Authentication provider
│   │   ├── Login.jsx           # Login form
│   │   └── Register.jsx        # Registration form
│   ├── chat/
│   │   ├── ChatView.jsx        # Main chat interface
│   │   ├── ChatMessage.jsx     # Individual message component
│   │   └── MessageContainer.jsx # Message list container
│   ├── Layout.jsx              # Main layout wrapper
│   ├── ProtectedRoute.jsx      # Route protection
│   └── WebSocketHandler.jsx    # WebSocket connection management
│   └── Sidebar.jsx             # Sidebar component
├── services/
│   └── Api.jsx                 # Axios configuration
├── store/
│   ├── store.js               # Redux store configuration
│   └── slices/
│       ├── authSlice.js       # Authentication state
│       ├── chatViewSlice.js   # Chat messages state
│       └── wsSlice.js         # WebSocket state
├── style/
│   ├── index.css             # Global styles
│   └── ChatMessage.css       # Message styling
│   └── Sidebar.css           # Sidebar styling
└── App.jsx                   # Main app component
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v22 or higher)
- npm or yarn

### Development Setup

1. **Clone the repository structure**
   ```bash
   # Create parent directory
   mkdir chat-application
   cd chat-application
   
   # Clone both repositories
   git clone <frontend-repository-url> chatapp-react-frontend
   git clone <backend-repository-url> chatapp-spring-backend
   ```

2. **Install dependencies**
   ```bash
   cd chatapp-react-frontend
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Copy example environment file
   cp .env.example .env
   ```
   
   Configure the following variables in `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   VITE_WS_BASE_URL=http://localhost:8080/ws
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open `http://localhost:5173` in your browser

## 🐋 Docker Setup

### Development with Docker
```bash
# From parent directory containing both repos
cd chatapp-spring-backend
docker-compose -f docker-compose.dev.yml up --build
```

### Production with Docker
```bash
# From parent directory containing both repos
cd chatapp-spring-backend
docker-compose up --build
```

## 🔧 Configuration

### API Configuration
The API base URL is configured in [`src/services/Api.jsx`](src/services/Api.jsx):
```javascript
const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true
});
```

### Redux Store
State management is configured in [`src/store/store.js`](src/store/store.js) with three main slices:
- **authSlice** - User authentication and token management
- **wsSlice** - WebSocket connection state
- **chatViewSlice** - Chat messages and UI state

## 🔐 Authentication Flow

1. User registers/logs in via [`Login.jsx`](src/components/auth/Login.jsx) or [`Register.jsx`](src/components/auth/Register.jsx)
2. JWT tokens are received and stored via [`AuthHandler`](src/components/auth/AuthHandler.jsx)
3. Protected routes are accessed through [`ProtectedRoute`](src/components/ProtectedRoute.jsx)
4. Automatic token refresh handles expired access tokens

## 💬 Real-time Messaging

The application uses WebSocket/STOMP for real-time communication:
- Connection managed by [`WebSocketHandler`](src/components/WebSocketHandler.jsx)
- Messages sent to `/app/chat` endpoint
- Real-time updates received from `/topic/messages`
- Message state managed in [`chatViewSlice`](src/store/slices/chatViewSlice.js)

## 📊 State Management

### Auth State
```javascript
{
   token: string,
   user: {
      email: string, 
      name: string,
      uid: string
   },
   isValidating: boolean,
}
```

### Chat State
```javascript
{
  chatViewCollection: [{
    viewId: number,
    title: string,
    messages: Array,
    isLoading: boolean,
    error: string
  }]
}
```

### WebSocket State
```javascript
{
  stompClient: StompClient,
  connectionStatus: 'connected' | 'disconnected' | 'connecting'
}
```

## 🎨 Styling

- **Bootstrap 5** for responsive layout and components
- **Custom CSS** in [`src/style/`](src/style/) for chat-specific styling
- **FontAwesome** icons for UI elements

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first Bootstrap grid system
- Flexible chat container sizing
- Responsive message bubbles
- Adaptive sidebar layout

## 🔍 Key Components

### ChatView
The main chat interface that handles:
- Message display and input
- WebSocket subscription management
- Real-time message updates
- Send message functionality

### MessageContainer
Displays chat messages with:
- Auto-scrolling to latest messages
- User/other message differentiation
- Sender name display

### AuthHandler
Manages authentication state:
- Token storage and validation
- Automatic token refresh
- User session management

## 📋 Dependencies

### Production Dependencies
- `react` & `react-dom` - Core React
- `@reduxjs/toolkit` & `react-redux` - State management
- `react-router-dom` - Routing
- `axios` - HTTP requests
- `@stomp/stompjs` - WebSocket messaging
- `bootstrap` & `react-bootstrap` - UI components
- `@fortawesome/*` - Icons

### Development Dependencies
- `vite` - Build tool
- `eslint` - Code linting
- Various ESLint plugins for React

## 🚀 Deployment

### Using Docker (Recommended)
The application is containerized and deployed using Docker Compose from the backend repository.

### Manual Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your web server

3. **Configure environment variables** for production API URLs

## 🐛 Troubleshooting

### Common Issues

1. **WebSocket connection fails**
   - Check backend WebSocket configuration
   - Verify CORS settings
   - Ensure backend is running

2. **Authentication issues**
   - Check token expiration
   - Verify API endpoints
   - Clear browser storage if needed

3. **Build errors**
   - Update dependencies
   - Check Node.js version compatibility

## 📚 Documentation

Additional documentation available in the [backend repository documentation folder](../chatapp-spring-backend/documentation):
- Architecture diagrams
- Sequence diagrams
- API integration guides

## 🏗️ System Architecture

![Application Architecture](../chatapp-spring-backend/documentation/diagrams/architecture.png)

## 🔐 Authentication Flow

![Authentication Sequence](../chatapp-spring-backend/documentation/diagrams/auth-sequence.png)

## 🔗 Related Projects

- [Backend Repository](../chatapp-spring-backend) - Spring Boot backend application

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This frontend is designed to work with the corresponding Spring Boot backend. Ensure both applications are running for full functionality.