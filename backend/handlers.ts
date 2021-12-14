import { IUser, Room, Message, MessageType } from "./types.ts";
import { sendMessage } from "./requests.ts";

export const generateRandomUUID = () => {
  return crypto.randomUUID();
};

export const startGame = (user: IUser, room: Room) => {
  return null;
};

// export const assignOpponentToRoom = (
//   room: Room,
//   user: IUser,
//   message: Message
// ) => {
//   if (room.opponent) throw Error("Room currently full");

//   if (room.password === message?.payload.password) {
//     room.opponent = {
//       socket: user.socket,
//       username: user.username,
//     };

//     const messagePayload: Message = {
//       type: MessageType.GAME_STARTED,
//     };

//     sendMessageToRoom(room, messagePayload);
//   }
// };

export const sendMessageToRoom = (room: Room, payload: Message) => {
  sendMessage(room.creator.socket, payload);
  if (room.opponent) sendMessage(room.opponent.socket, payload);
};
