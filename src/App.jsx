/* eslint-disable no-unused-vars */
import { Routes, Route } from 'react-router-dom';
import ChatDisplay from './components/ChatDisplay';
import WebSocketProvider from './components/WebSocketProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/Layout';

function App() {
  return (
    <WebSocketProvider>
      <Routes>
        <Route path="/" element={<Layout><ChatDisplay /></Layout>} />
      </Routes>
    </WebSocketProvider>
  );
}

export default App;
