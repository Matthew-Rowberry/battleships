import { sendMessage, receiveMessage } from "./requests.ts";
import { createRoom } from "./handlers.ts";
import { MessageType } from "./requests.ts";
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

export interface IUser {
  socket: WebSocket;
  username: string;
}

let roomLobby = [];

function handleSocket(socket: WebSocket) {
  let user: IUser;
  socket.onopen = () => console.log("socket opened");
  socket.onmessage = (e) => {
    const message = receiveMessage(e.data);
    try {
      // console.log("socket message:", e.data);
      if (message.type === "LOGIN" && !user)
        user = { socket, username: message.payload.username };

      if (user) {
        switch (message.type) {
          case "CREATE_ROOM": {
            const room = createRoom(user);
            sendMessage(socket, { type: MessageType.ACK, ref: message.ref });
            break;
          }

          default:
            break;
        }
      }

      if (message.ref)
        sendMessage(socket, { type: MessageType.ACK, ref: message.ref });

      // socket.send(new Date().toString());
    } catch (e) {
      if (message.ref)
        sendMessage(socket, { type: MessageType.ERROR, ref: message.ref });
    }
  };
  socket.onerror = (e) => console.log(e);
  // socket.onerror = (e) => console.log("socket errored:", e.message);
  socket.onclose = () => console.log("socket closed");
}
