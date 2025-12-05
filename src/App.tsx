/* eslint-disable no-unused-vars */
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Outlet, Route, Routes } from 'react-router-dom';
import AuthHandler from './components/auth/AuthHandler';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ChatView from './components/chat/ChatView';
import InitializationHandler from './components/InitializationHandler';
import Layout from './components/Layout';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import WebSocketHandler from './components/WebSocketHandler';
import { useAppSelector } from './store/hooks';
import theme from './theme';

function App() {
  const { currentlyDisplayedChatView } =useAppSelector(state => state.chatView);

  return (
    <AuthHandler> {/*provides acces to token and handles token auth*/}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<Login />} /> {/* login page where user gets redirected if not authorized */}
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <WebSocketHandler>
                <Profile />
              </WebSocketHandler>
            </ProtectedRoute>
          } />
          <Route element={
            <ProtectedRoute>
              <InitializationHandler>
                <WebSocketHandler>
                  <Layout>
                    <Outlet /> {/* child components, all child components are nested inside of ProtectedRoute => SocketProvider => Layout*/}
                  </Layout>
                </WebSocketHandler>
              </InitializationHandler>
            </ProtectedRoute>
          }>
            {/*here are child components to be rendered inside of outlet */}
            <Route path="/" element={<ChatView viewId={currentlyDisplayedChatView} />} /> 
          </Route>
        </Routes>
      </ThemeProvider>
    </AuthHandler>
  );
}

export default App;
