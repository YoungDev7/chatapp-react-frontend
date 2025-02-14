import ChatDisplay from './components/ChatDisplay';
import WebSocketProvider from './components/WebSocketProvider';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <>
    <WebSocketProvider>
      <ChatDisplay />
    </WebSocketProvider>
    </>
  )
}

export default App
