import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Button from '../../components/button';
import Ship from '../../components/ship';
import TakeTurn from '../../components/takeTurn';
import { UserRoomContext } from '../../context/userRoomProvider';
import { gridPlacement } from '../../types';
interface IBoardProps {
  boardWidth: number;
}

const Board = styled.div<IBoardProps>`
  width: ${(props) =>
    `calc((100px * ${props.boardWidth}) + (20px * ${props.boardWidth}))`};
  display: flex;
  flex-wrap: wrap;
`;

const getXYFromIndex = (i: number, boardWidth: number): gridPlacement => {
  const x = Math.floor(i / boardWidth);
  const y = i % boardWidth;
  return [x, y];
};

const Game: React.FC = () => {
  const userContext = useContext(UserRoomContext);
  // const [selectedOppPosition, setSelectedOppPosition] = useState<
  //   [number, number] | []
  // >([]);
  const boardWidth = 5;
  const boardHeight = 5;

  const placeShipOnBoard = (i: number, boardWidth: number) => {
    const clickedPosition = getXYFromIndex(i, boardWidth);
    userContext.placeShipOnBoard(clickedPosition);
  };

  const choosePosition = (i: number, boardWidth: number) => {
    const clickedPosition = getXYFromIndex(i, boardWidth);
    userContext.setSelectedOppPosition(clickedPosition);
  };

  const createBoard = (boardWidth: number, boardHeight: number) => {
    const gameGrid: JSX.Element[] = [];

    for (let i = 0; i < boardWidth * boardHeight; i++) {
      gameGrid.push(
        <Ship
          key={i}
          cb={() =>
            !userContext.isBoardLocked
              ? placeShipOnBoard(i, boardWidth)
              : choosePosition(i, boardWidth)
          }
          clicked={false}
        />
      );
    }

    return gameGrid;
  };

  return (
    <div>
      <h1>Game</h1>

      {/* SetUp Board */}
      <Board boardWidth={boardWidth}>
        {createBoard(boardWidth, boardHeight)}
      </Board>
      {!userContext.isBoardLocked ? (
        <Button
          disabled={userContext.userShipPlacements.length === 0}
          cb={() => userContext.placeShipsOnBoard()}
          textValue="place ships"
        />
      ) : (
        <TakeTurn />
      )}
    </div>
  );
};

export default Game;
