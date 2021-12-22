import React, { useState, useEffect, useContext } from 'react';
import BattleshipClient from '../api/client';
import { MessageType } from '../types';
import InputForm from '../features/inputForm';
import Button from '../components/button';
import { UserRoomContext } from '../context/userRoomProvider';
import Game from '../features/game/game';

const App: React.FC = () => {
  const userContext = useContext(UserRoomContext);

  const [username, updateUsername] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');

  useEffect(() => {
    BattleshipClient.subscribe('GAME_STARTED', userContext.startGame);
    return () => {
      BattleshipClient.unsubscribe('GAME_STARTED', userContext.startGame);
    };
  }, []);

  const login = async (username: string) => {
    userContext.sendUsernameToServer(username);
  };

  const createRoom = async () => {
    try {
      const response = await BattleshipClient.send({
        type: MessageType.CREATE_ROOM,
      });

      if (response.type === MessageType.ACK) {
        userContext.dispatch({
          type: MessageType.JOIN_ROOM,
          payload: response.payload,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const joinRoom = async (id: string) => {
    try {
      const response = await BattleshipClient.send({
        type: MessageType.JOIN_ROOM,
        payload: id,
      });

      if (response.type === MessageType.ACK) {
        userContext.dispatch({
          type: MessageType.JOIN_ROOM,
          payload: id,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const gameStarted = (payload: any) => {
    console.log(payload);
  };

  return (
    <div>
      {!userContext.session ? (
        <InputForm
          inputPlaceholder="Username"
          inputValue={username}
          inputCb={(e) => updateUsername(e)}
          inputLabel="Enter Username"
          btnDisabled={username.length === 0}
          btnCb={() => login(username)}
          btnText="Click me"
        />
      ) : !userContext.roomId ? (
        <div>
          Logged in as {username}
          <Button cb={() => createRoom()} textValue="Create Room"></Button>
          <InputForm
            inputPlaceholder="Join Room Password"
            inputValue={joinRoomId}
            inputCb={(e) => setJoinRoomId(e)}
            inputLabel="Join Room"
            btnDisabled={joinRoomId.length === 0}
            btnCb={() => joinRoom(joinRoomId)}
            btnText="Join Private Room"
          />
        </div>
      ) : !userContext.gameInProgress ? (
        <div>
          Logged in as {username}, your room id is:
          <p>
            <b>{userContext.roomId}</b>
          </p>
          share this room id to start a game
        </div>
      ) : (
        <Game />
      )}
    </div>
  );
};

export default App;
