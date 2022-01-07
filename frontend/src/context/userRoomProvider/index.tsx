import React, { useReducer } from 'react';
import { Message, MessageType } from '../../types';
import BattleshipClient from '../../api/client';
import { gridPlacement } from '../../types';
interface IUserRoom {
  session: boolean;
  roomId: string;
  gameInProgress: boolean;
  userShipPlacements: gridPlacement[];
  isCurrentlyUsersTurn: boolean;
  isBoardLocked: boolean;
}

const InitialState: IUserRoom = {
  session: false,
  roomId: '',
  gameInProgress: false,
  userShipPlacements: [],
  isCurrentlyUsersTurn: false,
  isBoardLocked: false,
};

interface IUserRoomContext extends IUserRoom {
  dispatch: (payload: Message) => void;
  sendUsernameToServer: (username: string) => void;
  deleteRoomId: () => void;
  startGame: () => void;
  placeShipOnBoard: (payload: gridPlacement) => void;
  placeShipsOnBoard: () => void;
  setTurn: (payload: boolean) => void;
  setSelectedOppPosition: (payload: gridPlacement) => void;
  takeTurn: (payload: gridPlacement) => void;
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

    case MessageType.PLACE_PIECE:
      let updatedShipPositions = state.userShipPlacements;
      const exists = updatedShipPositions.some((placement) => {
        return (
          placement[0] === action.payload[0] &&
          placement[1] === action.payload[1]
        );
      });

      if (!exists) {
        updatedShipPositions.push(action.payload);
      } else {
        updatedShipPositions = updatedShipPositions.filter((position) => {
          return (
            position[0] !== action.payload[0] ||
            position[1] !== action.payload[1]
          );
        });
      }

      return {
        ...state,
        userShipPlacements: updatedShipPositions,
      };

    case MessageType.LOCK_BOARD:
      return {
        ...state,
        isBoardLocked: true,
      };

    case MessageType.SET_TURN:
      return {
        ...state,
        isCurrentlyUsersTurn: action.payload,
      };
    // case MessageType.TURN_RESULT:
    //   return {
    //     ...state,
    //     isCurrentlyUsersTurn: false,
    //   };

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

  const placeShipOnBoard = (placement: gridPlacement) => {
    dispatch({ type: MessageType.PLACE_PIECE, payload: placement });
  };

  const placeShipsOnBoard = async () => {
    try {
      const response = await BattleshipClient.send({
        type: MessageType.PLACE_PIECES,
        payload: state.userShipPlacements,
      });

      if (response.type === MessageType.ACK) {
        dispatch({
          type: MessageType.LOCK_BOARD,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const setTurn = (payload: boolean) => {
    dispatch({ type: MessageType.SET_TURN, payload: payload });
  };

  const takeTurn = async (shipPosition: gridPlacement) => {
    try {
      const response = await BattleshipClient.send({
        type: MessageType.TAKE_TURN,
        payload: shipPosition,
      });

      // if (response.type === MessageType.ACK) {
      //   dispatch({
      //     type: MessageType.TURN_RESULT,
      //     payload: response.payload,
      //   });
      // }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserRoomContext.Provider
      value={{
        ...state,
        dispatch,
        sendUsernameToServer,
        deleteRoomId,
        startGame,
        placeShipOnBoard,
        placeShipsOnBoard,
        setTurn,
        takeTurn,
      }}
    >
      {children}
    </UserRoomContext.Provider>
  );
};

export default UserRoomProvider;
