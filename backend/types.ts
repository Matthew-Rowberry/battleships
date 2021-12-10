export interface IUser {
  socket: WebSocket;
  username: string;
}

export type Message =
  | ILoginMessage
  | IAckMessage
  | IErrMessage
  | ICreateRoom
  | IJoinRoom;

interface IMessage {
  type: string;
  ref?: number;
}

export enum MessageType {
  LOGIN = "LOGIN",
  ACK = "ACK",
  ERROR = "ERROR",
  CREATE_ROOM = "CREATE_ROOM",
  JOIN_ROOM = "JOIN_ROOM",
}

export interface ILoginMessage extends IMessage {
  type: MessageType.LOGIN;
  payload: {
    username: string;
  };
}

export interface IAckMessage extends IMessage {
  type: MessageType.ACK;
}

export interface IErrMessage extends IMessage {
  type: MessageType.ERROR;
}

export interface ICreateRoom extends IMessage {
  type: MessageType.CREATE_ROOM;
  payload: {
    roomType: RoomType;
    password: string;
  };
}

export interface IJoinRoom extends IMessage {
  type: MessageType.JOIN_ROOM;
  payload: {
    id: string;
    password: string;
  };
}

export interface ILobby {
  [id: string]: Room;
}

export type RoomType = "public" | "private";
export type Room = IRoom | IPrivateRoom;

interface IRoom {
  creator: IUser;
  opponent?: IUser;
  roomType: RoomType;
}

interface IPrivateRoom extends IRoom {
  passcode: string;
}

export interface IGame {}
