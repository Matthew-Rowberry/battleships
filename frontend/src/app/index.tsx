import React, { useState, useEffect } from 'react';
import Chat from '../features/chat';

const ws = new WebSocket('ws://192.168.158.228:9091');
ws.onerror = (error) => console.log(error);

const App: React.FC = () => {
  const [session, updateSession] = useState(false);
  const [currentMessage, updateCurrentMessage] = useState('');
  const [chat, updateChat] = useState<string[]>([]);

  useEffect(() => {
    // ws.onopen = () => updateSession(true);
    ws.onerror = () => updateSession(false);

    ws.onmessage = (message) => {
      console.log(message);
      const data = JSON.parse(message.data);
      if (data.type === 'RECIEVE_MESSAGE') {
        updateChat((prevChat) => [...prevChat, data.payload.content]);
      }
    };
  }, []);

  const inputMessage = (e: any) => {
    updateCurrentMessage(e.target.value);
  };

  const login = () => {
    ws.send(
      JSON.stringify({
        type: 'LOGIN',
        payload: {
          username: 'randomiom',
        },
      })
    );

    updateSession(true);
  };

  const sendMessageToChat = () => {
    ws.send(
      JSON.stringify({
        type: 'SEND_MESSAGE',
        payload: {
          content: currentMessage,
        },
      })
    );
    updateChat([...chat, currentMessage]);
    updateCurrentMessage('');
  };

  return (
    <div>
      <Chat chat={chat} />

      {!session ? 'Login to start chatting' : 'Logged in!'}
      <button
        onClick={() => {
          login();
        }}
      >
        Click to login
      </button>

      <form>
        <input
          disabled={!session}
          placeholder="Start Typing..."
          value={currentMessage}
          onChange={(e) => inputMessage(e)}
        />

        <button
          disabled={currentMessage.length === 0 || !session}
          onClick={() => {
            sendMessageToChat();
          }}
        >
          Click to send
        </button>
      </form>
    </div>
  );
};

export default App;
