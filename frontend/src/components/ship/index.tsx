import React, { useContext } from 'react';
import BattleshipClient from '../../api/client';
import styled from 'styled-components';
import { MessageType } from '../../types';
import Button from '../button';
import { UserRoomContext } from '../../context/userRoomProvider';

interface IShipContainerProps {
  clicked: boolean;
}

interface IShipProps extends IShipContainerProps {
  cb: () => void;
}

const ShipContainer = styled.span<IShipContainerProps>`
  width: 100px;
  height: 100px;
  margin: 10px;
  display: block;
  background-color: ${(props) => (props.clicked ? 'green' : 'grey')};
`;

const Ship: React.FC<IShipProps> = ({ cb, clicked }) => {
  const userContext = useContext(UserRoomContext);

  return <ShipContainer onClick={cb} clicked={clicked} />;
};

export default Ship;
