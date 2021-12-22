import { sendMessage, receiveMessage } from "./requests.ts";
import { Message, MessageType, IUser, IApplication } from "./types.ts";
import {
  createGame,
  disconnectGame,
  startGame,
  getBoard,
  getEnemyBoard,
  setTurn,
  finishGame,
  hasWon,
  takeTurn,
} from "./game.ts";

const application: IApplication = {
  rooms: {},
};

// Messages for logged in users
function handleUserMessage(user: IUser, message: Message) {
  switch (message.type) {
    case MessageType.CREATE_ROOM: {
      if (user.currentRoom) {
        delete application.rooms[user.currentRoom];
      }

      const lobby = {
        creator: user,
      };

      const id = crypto.randomUUID();
      application.rooms[id] = lobby;
      user.currentRoom = id;

      return id;
    }

    case MessageType.JOIN_ROOM: {
      const id = message.payload;
      const lobby = application.rooms[id];

      if (!lobby) {
        throw Error("Invalid room");
      }

      delete application.rooms[id];

      const game = createGame(user, lobby.creator);
      user.currentRoom = undefined;
      lobby.creator.currentRoom = undefined;
      startGame(game);

      return;
    }

    case MessageType.PLACE_PIECES: {
      if (!user.game) throw Error("Join a game first");

      const userBoard = getBoard(user, user.game);
      if (userBoard.locked) throw Error("Game board is locked");

      userBoard.pieces = message.payload;
      userBoard.locked = true;

      if (user.game.boards.every((board) => board.locked)) {
        setTurn(user.game);
      }

      return;
    }

    case MessageType.TAKE_TURN: {
      if (!user.game) throw Error("Join a game first");

      const userBoard = getBoard(user, user.game);
      const enemyBoard = getEnemyBoard(user, user.game);
      if (!userBoard.locked || !enemyBoard.locked)
        throw Error("Game board needs to be locked in");
      if (user.game.turn !== user.game.users.indexOf(user))
        throw Error("Not your turn");

      takeTurn(user.game, enemyBoard, message.payload);

      if (hasWon(user, user.game)) {
        finishGame(user, user.game);
      } else {
        setTurn(user.game);
      }

      return;
    }

    default:
      break;
  }
}

function handleSocket(socket: WebSocket) {
  let user: IUser;

  socket.onopen = () => console.log("socket opened");
  socket.onmessage = (e) => {
    const message = receiveMessage(e.data);
    console.log(message);

    try {
      if (message.type === "LOGIN" && !user) {
        user = { socket, username: message.payload.username };
      }

      if (user) {
        const response = handleUserMessage(user, message);

        if (message.ref) {
          sendMessage(socket, {
            type: MessageType.ACK,
            ref: message.ref,
            payload: response,
          });
        }
      }
    } catch (e) {
      if (message.ref) {
        sendMessage(socket, {
          type: MessageType.ERROR,
          ref: message.ref,
          payload: e.message,
        });
      }
    }
  };

  socket.onerror = (e) => console.log(e);

  socket.onclose = () => {
    if (user?.currentRoom) {
      delete application.rooms[user.currentRoom];
    }

    if (user?.game) {
      disconnectGame(user.game, user);
    }
  };
}

export default handleSocket;
