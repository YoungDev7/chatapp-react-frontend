/* eslint-disable no-unused-vars */
import CssBaseline from '@mui/material/CssBaseline';
import { Outlet, Route, Routes } from 'react-router-dom';
import AuthHandler from './components/auth/AuthHandler';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ChatView from './components/chat/ChatView';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import WebSocketHandler from './components/WebSocketHandler';

function App() {
  return (
    <AuthHandler> {/*provides acces to token and handles token auth*/}
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<Login />} /> {/* login page where user gets redirected if not authorized */}
        <Route path="/register" element={<Register />} />
        <Route element={
          <ProtectedRoute>
            <WebSocketHandler>
              <Layout>
                <Outlet /> {/* child components, all child components are nested inside of ProtectedRoute => SocketProvider => Layout*/}
              </Layout>
            </WebSocketHandler>
          </ProtectedRoute>
        }>
          {/*here are child components to be rendered inside of outlet */}
          <Route path="/" element={<ChatView />} /> 
        </Route>
      </Routes>
    </AuthHandler>
  );
}

export default App;
