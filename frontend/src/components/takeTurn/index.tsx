import React, { useContext } from 'react';
import Button from '../button';
import { UserRoomContext } from '../../context/userRoomProvider';

const TakeTurn: React.FC = () => {
  const userContext = useContext(UserRoomContext);

  return (
    <Button
      cb={() => userContext.takeTurn([1, 1])}
      textValue="Take Turn"
      disabled={!userContext.isCurrentlyUsersTurn}
    />
  );
};

export default TakeTurn;
