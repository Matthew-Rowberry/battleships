import handleSocket from './app.ts';

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

const server = Deno.listen({ port: 8080 });

for await (const conn of server) {
  handle(conn);
}
