import { Message } from "./types.ts";

export const sendMessage = (ws: WebSocket, message: Message) => {
  ws.send(JSON.stringify(message));
};

export const receiveMessage = (message: string): Message => {
  return JSON.parse(message);
};
