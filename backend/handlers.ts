import { IUser } from "./app.ts";
import { RoomType } from "./request.ts";
import { v4 } from "https://deno.land/std@0.117.0/uuid/mod.ts";

interface IRoom {
  creator: IUser;
  opponent?: IUser;
  id: string;
  roomType: RoomType;
}

interface IGame {}

export const createRoom = (user: IUser): IRoom => {
  return { creator: user, id: crypto.randomUUID(), roomType };
};

export const startGame = (user: IUser, room: IRoom) => {
  room.opponent = user;
};
