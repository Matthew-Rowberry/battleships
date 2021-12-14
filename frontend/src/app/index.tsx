import React, { useState, useEffect } from 'react';
import BattleshipClient from '../api';
import { MessageType } from '../types';
import Button from '../components/button/Button';
import UserRoom from '../context/ContextProvider';
import InputForm from '../features/chat/InputForm';

const App: React.FC = () => {
  const [username, updateUsername] = useState('');
  const [session, updateSession] = useState(false);
  const [createRoomPassword, setCreateRoomPassword] = useState('');
  const [joinRoomPassword, setJoinRoomPassword] = useState('');

  useEffect(() => {
    BattleshipClient.subscribe('GAME_STARTED', gameStarted);
    return () => {
      BattleshipClient.unsubscribe('GAME_STARTED', gameStarted);
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

  const gameStarted = (payload: unknown) => {
    console.log(payload);

    // console.log('runs');
  };

  return (
    <UserRoom>
      <div>
        {!session ? (
          <InputForm
            inputPlaceholder="Username"
            inputValue={username}
            inputCb={(e) => updateUsername(e)}
            inputLabel="Enter Username"
            btnDisabled={username.length === 0}
            btnCb={() => login(username)}
            btnText="Click me"
          />
        ) : (
          <>
            Logged in as {username}
            <Button
              disabled
              cb={() => createRoom('private', createRoomPassword)}
              textValue="Create Public Room (Coming Soon)"
            />
            <InputForm
              inputPlaceholder="Create Room Password"
              inputValue={createRoomPassword}
              inputCb={(e) => setCreateRoomPassword(e)}
              inputLabel="Enter Passcode"
              btnDisabled={createRoomPassword.length === 0}
              btnCb={() => createRoom('private', createRoomPassword)}
              btnText="Create Private Room"
            />
            <InputForm
              inputPlaceholder="Join Room Password"
              inputValue={joinRoomPassword}
              inputCb={(e) => setJoinRoomPassword(e)}
              inputLabel="Join Room"
              btnDisabled={joinRoomPassword.length === 0}
              btnCb={() => joinRoom(joinRoomPassword)}
              btnText="Join Private Room"
            />
          </>
        )}
      </div>
    </UserRoom>
  );
};

export default App;
