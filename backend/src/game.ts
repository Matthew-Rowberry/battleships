import {
  IGame,
  IUser,
  IApplication,
  MessageType,
  Message,
  IBoard,
} from "./types.ts";
import { sendMessage } from "./requests.ts";

// Init

export function createGame(player1: IUser, player2: IUser): IGame {
  const game: IGame = {
    users: [player1, player2],
    boards: [
      { pieces: [], shots: [], locked: false },
      { pieces: [], shots: [], locked: false },
    ],
    turn: 0,
  };

  player1.game = game;
  player2.game = game;

  return game;
}

// Actions

export function disconnectGame(game: IGame, disconnectedUser: IUser) {
  // @TODO delete game when user is removed and push remaining user into new room
  // broadcastExclude(game, disconnectedUser, {
  //   type: MessageType.GAME_CLOSE,
  // });
}

export function startGame(game: IGame) {
  broadcast(game, {
    type: MessageType.GAME_STARTED,
  });
}

export function takeTurn(
  game: IGame,
  enemyBoard: IBoard,
  target: [number, number]
) {
  const exists = enemyBoard.pieces.some(
    (piece) => piece[0] === target[0] && piece[1] === target[1]
  );

  enemyBoard.shots.push(target);

  broadcast(game, {
    type: MessageType.TURN_RESULT,
    payload: {
      hit: exists,
      location: target,
    },
  });
}

export function finishGame(winner: IUser, game: IGame) {
  for (const player of game.users) {
    sendMessage(player.socket, {
      type: MessageType.GAME_RESULT,
      payload: player === winner,
    });

    player.game = undefined;
  }
}

export function setTurn(game: IGame) {
  game.turn = game.turn ? 0 : 1;

  for (const [index, player] of game.users.entries()) {
    sendMessage(player.socket, {
      type: MessageType.SET_TURN,
      payload: index === game.turn,
    });
  }
}

// Getters

export function hasWon(user: IUser, game: IGame) {
  const enemyBoard = getEnemyBoard(user, game);

  return enemyBoard.pieces.every((piece) =>
    enemyBoard.shots.find(
      (shot) => shot[0] === piece[0] && shot[1] === piece[1]
    )
  );
}

export function getBoard(user: IUser, game: IGame) {
  const index = game.users.indexOf(user);
  return game.boards[index];
}

export function getEnemyBoard(user: IUser, game: IGame) {
  const index = game.users.indexOf(user);
  return game.boards[index ? 0 : 1];
}

// Broadcasters

export function broadcast(game: IGame, message: Message) {
  for (const player of game.users) {
    sendMessage(player.socket, message);
  }
}

export function broadcastExclude(game: IGame, user: IUser, message: Message) {
  for (const player of game.users) {
    if (player != user) {
      sendMessage(player.socket, message);
    }
  }
}
