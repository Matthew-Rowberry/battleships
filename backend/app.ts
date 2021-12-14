import { sendMessage, receiveMessage } from "./requests.ts";
import { generateRandomUUID, sendMessageToRoom } from "./handlers.ts";
import { Message, MessageType, IUser, ILobby } from "./types.ts";

const server = Deno.listen({ port: 8080 });
const roomLobby: ILobby = {};

for await (const conn of server) {
  handle(conn);
}

async function handle(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const requestEvent of httpConn) {
    await requestEvent.respondWith(handleReq(requestEvent.request));
  }
}

function handleReq(req: Request): Response {
  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() !== "websocket") {
    return new Response("request isn't trying to upgrade to websocket.");
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  handleSocket(socket);
  return response;
}

function handleSocket(socket: WebSocket) {
  let user: IUser;
  socket.onopen = () => console.log("socket opened");
  socket.onmessage = (e) => {
    const message = receiveMessage(e.data);
    try {
      if (message.type === "LOGIN" && !user)
        user = { socket, username: message.payload.username };

      if (user) {
        switch (message.type) {
          case MessageType.CREATE_ROOM: {
            const id = generateRandomUUID();
            const room = {
              creator: user,
              roomType: message.payload.roomType,
              password: message.payload.password,
            };
            roomLobby[id] = room;

            sendMessage(socket, {
              type: MessageType.ACK,
              ref: message.ref,
              payload: { id, message: "waiting_for_player" },
            });
            return;
          }

          case MessageType.JOIN_ROOM: {
            for (const key in roomLobby) {
              if (Object.prototype.hasOwnProperty.call(roomLobby, key)) {
                const element = roomLobby[key];
                // return assignOpponentToRoom(roomLobby[key], user, message);

                if (element.opponent) throw Error("Room currently full");

                if (element.password === message.payload.password) {
                  element.opponent = {
                    socket: user.socket,
                    username: user.username,
                  };

                  sendMessageToRoom(element, {
                    type: MessageType.GAME_STARTED,
                  });
                  return;
                }
              }
            }

            throw Error("No rooms with matching password");
          }

          default:
            break;
        }
      }
      if (message.ref)
        sendMessage(socket, { type: MessageType.ACK, ref: message.ref });
    } catch (e) {
      console.log(e);
      if (message.ref)
        sendMessage(socket, { type: MessageType.ERROR, ref: message.ref });
    }
  };
  socket.onerror = (e) => console.log(e);
  // socket.onerror = (e) => console.log("socket errored:", e.message);
  socket.onclose = () => console.log("socket closed");
}
