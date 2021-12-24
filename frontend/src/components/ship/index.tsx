import React from 'react';
import BattleshipClient from '../../api/client';
import styled from 'styled-components';
import { MessageType } from '../../types';

interface IProps {
  index: number;
}

const ShipContainer = styled.span`
  width: 100px;
  height: 100px;
  display: block;
  background-color: red;
`;

const placeShipOnSpace = async ([[x, y]]: [number, number][]) => {
  try {
    await BattleshipClient.send({
      type: MessageType.PLACE_PIECES,
      payload: { x, y },
    });
  } catch (err) {
    console.log(err);
  }
};

const Ship: React.FC<IProps> = (index) => {
  return <ShipContainer onClick={() => placeShipOnSpace([[1, 1]])} />;
};

export default Ship;
