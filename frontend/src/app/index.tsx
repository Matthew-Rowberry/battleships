import React, { useState, useEffect } from 'react';
import Chat from '../features/chat';
import BattleshipClient from '../api';
import { MessageType } from '../types';
import Button from '../components/button/Button';
import TextInput from '../components/button/textInput/TextInput';

const App: React.FC = () => {
  const [username, updateUsername] = useState('');
  const [session, updateSession] = useState(false);
  const [createRoomPassword, setCreateRoomPassword] = useState('');
  const [joinRoomPassword, setJoinRoomPassword] = useState('');

  useEffect(() => {
    BattleshipClient.subscribe('game_started', gameStarted);
    return () => {
      BattleshipClient.unsubscribe('game_started', gameStarted);
    };
  }, []);

  const login = async (username: string) => {
    try {
      await BattleshipClient.send({
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

  const gameStarted = (payload: unknown) => {
    console.log('runs');
  };

  const createRoom = async (
    roomType: 'public' | 'private',
    password: string
  ) => {
    try {
      const response: any = await BattleshipClient.send({
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

  const joinRoom = async (password: string) => {
    try {
      const response: any = await BattleshipClient.send({
        type: MessageType.JOIN_ROOM,
        payload: {
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
          <TextInput
            placeholder="Username..."
            inputValue={username}
            cb={(e) => updateUsername(e)}
          >
            Log in to start
          </TextInput>

          <Button disabled={username.length === 0} cb={() => login(username)}>
            Click Me
          </Button>
        </form>
      ) : (
        <>
          Logged in as {username}
          <Button disabled cb={() => createRoom('private', createRoomPassword)}>
            Create Public Room (Coming Soon)
          </Button>
          <form>
            <TextInput
              type="password"
              placeholder="Create Room Password"
              inputValue={createRoomPassword}
              cb={(e) => setCreateRoomPassword(e)}
            >
              Enter Passcode
            </TextInput>
            <Button
              disabled={createRoomPassword.length === 0}
              cb={() => createRoom('private', createRoomPassword)}
            >
              Create Private Room
            </Button>
          </form>
          <form>
            <TextInput
              type="password"
              placeholder="Join Room Password"
              inputValue={joinRoomPassword}
              cb={(e) => setJoinRoomPassword(e)}
            >
              Join Room
            </TextInput>
            <Button
              disabled={joinRoomPassword.length === 0}
              cb={() => joinRoom(joinRoomPassword)}
            >
              Join Private Room
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default App;
