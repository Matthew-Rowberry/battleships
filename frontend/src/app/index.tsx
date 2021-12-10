import React, { useState, useEffect } from 'react';
import Chat from '../features/chat';
import BattleshipClient from '../api';
import { MessageType } from '../types';

const App: React.FC = () => {
  const [username, updateUsername] = useState('');
  const [session, updateSession] = useState(false);
  const [password, updatePassword] = useState('');

  const login = async (username: string) => {
    try {
      const response = await BattleshipClient.send({
        type: MessageType.LOGIN,
        payload: {
          username,
        },
      });

      updateSession(true);
    } catch (e) {
      console.log(e);
      // something went wrong, not ACK
    }
  };

  const createRoom = async (
    roomType: 'public' | 'private',
    password: string
  ) => {
    try {
      const response = await BattleshipClient.send({
        type: MessageType.CREATE_ROOM,
        payload: {
          roomType,
          password,
        },
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      {!session ? (
        <form>
          <label>
            Log in to start
            <input
              type="text"
              placeholder="Input Username"
              value={username}
              onChange={(e) => updateUsername(e.target.value)}
            />
          </label>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              login(username);
            }}
            disabled={username.length === 0}
          >
            Click to login
          </button>
        </form>
      ) : (
        <>
          Logged in as {username}
          <button
            disabled={true}
            onClick={() => {
              createRoom('public', 'public');
            }}
          >
            Create Public Room (Coming Soon)
          </button>
          <form>
            <label>
              Enter Passcode
              <input
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => updatePassword(e.target.value)}
              />
            </label>
            <button
              onClick={() => {
                createRoom('private', password);
              }}
            >
              Create Private Room
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default App;
