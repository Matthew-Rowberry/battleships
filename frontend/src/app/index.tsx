import React, { useState, useEffect } from 'react';
import Chat from '../features/chat';
import BattleshipClient from '../api';
import { MessageType } from '../types';
import Button from '../features/button/Button';

const App: React.FC = () => {
  const [username, updateUsername] = useState('');
  const [session, updateSession] = useState(false);
  const [password, updatePassword] = useState('');

  const login = async (username: string) => {
    console.log('log');

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

          <Button disabled={username.length === 0} cb={() => login(username)}>
            Click Me
          </Button>
        </form>
      ) : (
        <>
          Logged in as {username}
          <Button disabled cb={() => createRoom('private', password)}>
            Create Public Room (Coming Soon)
          </Button>
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
            <Button
              disabled={password.length === 0}
              cb={() => createRoom('private', password)}
            >
              Create Private Room
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default App;
