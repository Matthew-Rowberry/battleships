export interface ISubscribers {
  [key: string]: ((value: unknown) => void)[];
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

export type Message =
  | ILoginMessage
  | IAckMessage
  | IErrMessage
  | IWaitingForPlayer
  | ICreateRoom
  | IJoinRoom;

interface IMessage {
  type: string;
  ref?: number;
}

export enum MessageType {
  LOGIN = 'LOGIN',
  ACK = 'ACK',
  ERROR = 'ERROR',
  CREATE_ROOM = 'CREATE_ROOM',
  JOIN_ROOM = 'JOIN_ROOM',
  WAITING_FOR_PLAYER = 'WAITING_FOR_PLAYER',
}

interface ILoginMessage extends IMessage {
  type: MessageType.LOGIN;
  payload: {
    username: string;
  };
}

interface IAckMessage extends IMessage {
  type: MessageType.ACK;
  payload?: unknown;
}

interface IErrMessage extends IMessage {
  type: MessageType.ERROR;
  payload?: unknown;
}

interface ICreateRoom extends IMessage {
  type: MessageType.CREATE_ROOM;
  payload: {
    roomType: RoomType;
  };
}

export interface IWaitingForPlayer extends IMessage {
  type: MessageType.WAITING_FOR_PLAYER;
  payload: {
    roomId: string;
    room: IRoom;
  };
}
interface IJoinRoom extends IMessage {
  type: MessageType.JOIN_ROOM;
}

export type InputTypes = 'text' | 'password' | 'number';
