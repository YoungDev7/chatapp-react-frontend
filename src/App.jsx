/* eslint-disable no-unused-vars */
import { Routes, Route, Outlet } from 'react-router-dom';
import ChatDisplay from './components/ChatDisplay';
import WebSocketProvider from './components/WebSocketProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/Layout';
import AuthProvider from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider> {/*provides acces to token and handles token auth*/}
      <Routes>
        <Route path="/login" element={<Login />} /> {/* login page where user gets redirected if not authorized */}
        <Route element={
          <ProtectedRoute>
            <WebSocketProvider>
              <Layout>
                <Outlet /> {/* child components, all child components are nested inside of ProtectedRoute => SocketProvider => Layout*/}
              </Layout>
            </WebSocketProvider>
          </ProtectedRoute>
        }>
          {/*here are child components to be rendered inside of outlet */}
          <Route path="/" element={<ChatDisplay />} /> 
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
