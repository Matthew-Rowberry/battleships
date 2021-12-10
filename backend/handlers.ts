import { IUser, Room } from "./types.ts";

export const generateRandomUUID = () => {
  return crypto.randomUUID();
};

export const startGame = (user: IUser, room: Room) => {
  room.opponent = user;
};
