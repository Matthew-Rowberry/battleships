import { sendMessage, receiveMessage } from "./requests.ts";
import { generateRandomUUID } from "./handlers.ts";
import { MessageType, IUser, ILobby } from "./types.ts";

const server = Deno.listen({ port: 8080 });

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
  const roomLobby: ILobby = {};
  socket.onopen = () => console.log("socket opened");
  socket.onmessage = (e) => {
    const message = receiveMessage(e.data);
    try {
      if (message.type === "LOGIN" && !user) {
        user = { socket, username: message.payload.username };
        console.log(`user ${user.username} logged in`);
      }

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
            break;
          }

          case MessageType.JOIN_ROOM: {
            break;
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
