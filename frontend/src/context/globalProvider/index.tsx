import React from 'react';
import UserRoomProvider from '../userRoomProvider';

const GlobalProvider: React.FC = ({ children }) => {
  return <UserRoomProvider>{children}</UserRoomProvider>;
};

export default GlobalProvider;
