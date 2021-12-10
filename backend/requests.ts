type Message =
  | ILoginMessage
  | IAckMessage
  | IErrMessage
  | ICreateRoom
  | IJoinRoom;

interface IMessage {
  type: string;
  ref?: number;
}

export type RoomType = "public" | "private";

export enum MessageType {
  LOGIN = "LOGIN",
  ACK = "ACK",
  ERROR = "ERROR",
  CREATE_ROOM = "CREATE_ROOM",
  JOIN_ROOM = "JOIN_ROOM",
}

interface ILoginMessage extends IMessage {
  type: MessageType.LOGIN;
  payload: {
    username: string;
  };
}

interface IAckMessage extends IMessage {
  type: MessageType.ACK;
}

interface IErrMessage extends IMessage {
  type: MessageType.ERROR;
}

interface ICreateRoom extends IMessage {
  type: MessageType.CREATE_ROOM;
  payload: {
    roomType: RoomType;
  };
}

interface IJoinRoom extends IMessage {
  type: MessageType.JOIN_ROOM;
}

export const sendMessage = (ws: WebSocket, message: Message) => {
  ws.send(JSON.stringify(message));
};

export const receiveMessage = (message: string): Message => {
  return JSON.parse(message);
};
