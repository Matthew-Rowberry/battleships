import React, { useReducer } from 'react';
import { Message, MessageType } from '../../types';
import BattleshipClient from '../../api/client';

interface IUserRoom {
  session: boolean;
  roomId: string;
  gameInProgress: boolean;
}

const InitialState: IUserRoom = {
  session: false,
  roomId: '',
  gameInProgress: false,
};

interface IUserRoomContext extends IUserRoom {
  dispatch: (payload: Message) => void;
  sendUsernameToServer: (username: string) => void;
  deleteRoomId: () => void;
  startGame: () => void;
}

function reducer(state: IUserRoom, action: Message): IUserRoom {
  switch (action.type) {
    case MessageType.LOGIN:
      return {
        ...state,
        session: true,
      };

    case MessageType.JOIN_ROOM:
      return {
        ...state,
        roomId: action.payload,
      };
    case MessageType.CLOSE_ROOM:
      return {
        ...state,
        roomId: '',
      };

    case MessageType.GAME_STARTED:
      return {
        ...state,
        gameInProgress: true,
      };

    default:
      throw new Error();
  }
}

export const UserRoomContext = React.createContext<IUserRoomContext>(
  {} as IUserRoomContext
);

const UserRoomProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, InitialState);

  const sendUsernameToServer = async (username: string) => {
    try {
      await BattleshipClient.send({
        type: MessageType.LOGIN,
        payload: {
          username,
        },
      });

      dispatch({ type: MessageType.LOGIN, payload: { username } });
    } catch (e) {
      console.log(e);
      // something went wrong, not ACK
    }
  };

  const deleteRoomId = async () => {
    try {
      await BattleshipClient.send({
        type: MessageType.CLOSE_ROOM,
        payload: state.roomId,
      });

      dispatch({ type: MessageType.CLOSE_ROOM });
    } catch (e) {
      console.log(e);
    }
  };

  const startGame = () => {
    dispatch({ type: MessageType.GAME_STARTED });
  };

  return (
    <UserRoomContext.Provider
      value={{
        ...state,
        dispatch,
        sendUsernameToServer,
        deleteRoomId,
        startGame,
      }}
    >
      {children}
    </UserRoomContext.Provider>
  );
};

export default UserRoomProvider;
