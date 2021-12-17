type RoomId = string;

export interface IWaitingRoom {
  creator: IUser,
}

export interface IBoard {
  pieces: [number, number][];
  shots: [number, number][];
  locked: boolean;
}

export interface IGame {
  users: [IUser, IUser],
  boards: [IBoard, IBoard],
  turn: number,
}

export interface IApplication {
  rooms: Record<RoomId, IWaitingRoom>,
}

export interface IUser {
  socket: WebSocket;
  username: string;
  currentRoom?: RoomId;
  game?: IGame,
}

// ----

export type Message =
  | ILoginMessage
  | IAckMessage
  | IErrMessage
  | IGameClose
  | ICreateRoom
  | IJoinRoom
  | IGameStarted
  | IPlacePieces
  | ISetTurn
  | ITakeTurn
  | ITurnResult
  | IGameResult;

interface IMessage {
  type: string;
  ref?: number;
}

export enum MessageType {
  LOGIN = "LOGIN",
  ACK = "ACK",
  ERROR = "ERROR",

  // ROOM ACTIONS
  CREATE_ROOM = "CREATE_ROOM",
  JOIN_ROOM = "JOIN_ROOM",

  // GAME ACTIONS
  GAME_CLOSE = "GAME_CLOSE",
  GAME_STARTED = "GAME_STARTED",
  PLACE_PIECES = "PLACE_PIECES",
  SET_TURN = "SET_TURN",
  TAKE_TURN = "TAKE_TURN",
  TURN_RESULT = "TURN_RESULT",
  GAME_RESULT = "GAME_RESULT",
}

export interface ILoginMessage extends IMessage {
  type: MessageType.LOGIN;
  payload: {
    username: string;
  };
}

export interface IAckMessage extends IMessage {
  type: MessageType.ACK;
  payload?: unknown;
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
  payload: string
}

//

export interface IGameStarted extends IMessage {
  type: MessageType.GAME_STARTED;
}

export interface IGameClose extends IMessage {
  type: MessageType.GAME_CLOSE;
}

export interface IPlacePieces extends IMessage {
  type: MessageType.PLACE_PIECES;
  payload: [number, number][];
}

export interface ISetTurn extends IMessage {
  type: MessageType.SET_TURN;
  payload: boolean;
}

export interface ITakeTurn extends IMessage {
  type: MessageType.TAKE_TURN;
  payload: [number, number];
}

export interface ITurnResult extends IMessage {
  type: MessageType.TURN_RESULT;
  payload: {
    location: [number, number],
    hit: boolean,
  };
}

export interface IGameResult extends IMessage {
  type: MessageType.GAME_RESULT;
  payload: boolean;
}
