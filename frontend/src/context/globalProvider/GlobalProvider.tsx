import React from 'react';
import UserRoomProvider from '../userRoomProvider/UserRoomProvider';

const GlobalProvider: React.FC = ({ children }) => {
  return <UserRoomProvider>{children}</UserRoomProvider>;
};

export default GlobalProvider;
