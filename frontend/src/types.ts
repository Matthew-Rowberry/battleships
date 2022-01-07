export interface ISubscribers {
  //@TODO type each messagetype and remove any
  [key: string]: ((value: any) => void)[];
}

export interface IUser {
  socket: WebSocket;
  username: string;
}

export type RoomType = 'public' | 'private';
interface IRoom {
  creator: IUser;
  opponent?: IUser;
  roomType: RoomType;
  //@TODO Adding password here but will need to be removed once public rooms become a thing
  password: string;
}

export type InputTypes = 'text' | 'password' | 'number';
export type gridPlacement = [number, number];

export type Message =
  | ILoginMessage //Done
  | IAckMessage // Done
  | IErrMessage // Done
  | ICreateRoom // Done
  | IJoinRoom // Done
  | ICloseRoom
  | IGameStarted // Done
  | IPlacePiece
  | IPlacePieces
  | ILockBoard
  | ISetTurn
  | ITakeTurn
  | ITurnResult
  | IGameResult
  | IGameClose;

interface IMessage {
  type: string;
  ref?: number;
}

export enum MessageType {
  LOGIN = 'LOGIN',
  ACK = 'ACK',
  ERROR = 'ERROR',

  // ROOM ACTIONS
  CREATE_ROOM = 'CREATE_ROOM',
  JOIN_ROOM = 'JOIN_ROOM',
  CLOSE_ROOM = 'CLOSE_ROOM',

  // GAME ACTIONS
  GAME_CLOSE = 'GAME_CLOSE',
  GAME_STARTED = 'GAME_STARTED',
  PLACE_PIECE = 'PLACE_PIECE',
  PLACE_PIECES = 'PLACE_PIECES',
  LOCK_BOARD = 'LOCK_BOARD',
  SET_TURN = 'SET_TURN',
  TAKE_TURN = 'TAKE_TURN',
  TURN_RESULT = 'TURN_RESULT',
  GAME_RESULT = 'GAME_RESULT',
}

export interface ILoginMessage extends IMessage {
  type: MessageType.LOGIN;
  payload: {
    username: string;
  };
}

export interface IAckMessage extends IMessage {
  type: MessageType.ACK;
  payload?: any;
}

export interface IErrMessage extends IMessage {
  type: MessageType.ERROR;
  payload: unknown;
}

//

export interface ICreateRoom extends IMessage {
  type: MessageType.CREATE_ROOM;
}

export interface IJoinRoom extends IMessage {
  type: MessageType.JOIN_ROOM;
  payload: string;
}

export interface ICloseRoom extends IMessage {
  type: MessageType.CLOSE_ROOM;
  payload?: string;
}

//

export interface IGameStarted extends IMessage {
  type: MessageType.GAME_STARTED;
}

export interface IGameClose extends IMessage {
  type: MessageType.GAME_CLOSE;
}

export interface IPlacePiece extends IMessage {
  type: MessageType.PLACE_PIECE;
  payload: gridPlacement;
}

export interface IPlacePieces extends IMessage {
  type: MessageType.PLACE_PIECES;
  payload: gridPlacement[];
}

export interface ILockBoard extends IMessage {
  type: MessageType.LOCK_BOARD;
}

export interface ISetTurn extends IMessage {
  type: MessageType.SET_TURN;
  payload: boolean;
}

export interface ITakeTurn extends IMessage {
  type: MessageType.TAKE_TURN;
  payload: gridPlacement;
}

export interface ITurnResult extends IMessage {
  type: MessageType.TURN_RESULT;
  payload: {
    location: gridPlacement;
    hit: boolean;
  };
}

export interface IGameResult extends IMessage {
  type: MessageType.GAME_RESULT;
  payload: boolean;
}
