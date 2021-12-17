import React, { useReducer } from 'react';
import { Message, MessageType } from '../../types';

interface IUserRoom {
  id: string;
}

const InitialState: IUserRoom = { id: '1' };
interface IUserRoomContext extends IUserRoom {
  assignCreatorToRoom: (payload: any) => void;
  dispatch: (payload: Message) => void;
}

function reducer(state: IUserRoom, action: Message): IUserRoom {
  switch (action.type) {
    case MessageType.JOIN_ROOM:
      return state;

    default:
      throw new Error();
  }
}

export const UserRoomContext = React.createContext<IUserRoomContext>(
  {} as IUserRoomContext
);

const assignCreatorToRoom = (payload: any) => {
  console.log(payload);

  return;
};

const UserRoomProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, InitialState);

  return (
    <UserRoomContext.Provider
      value={{ ...state, dispatch, assignCreatorToRoom }}
    >
      {children}
    </UserRoomContext.Provider>
  );
};

export default UserRoomProvider;
