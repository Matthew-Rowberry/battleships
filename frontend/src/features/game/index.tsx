import React from 'react';
import styled from 'styled-components';
import Ship from '../../components/ship';

const Board = styled.div``;

const Game: React.FC = () => {
  const gridWidth = 3;
  const gridHeight = 3;

  const gameGrid: any = [];

  for (let i = 0; i < gridWidth * gridHeight; i++) {
    gameGrid.push(<Ship index={i} />);
  }

  return (
    <div>
      <h1>Game</h1>

      {/* SetUp Board */}
      <Board></Board>
    </div>
  );
};

export default Game;
