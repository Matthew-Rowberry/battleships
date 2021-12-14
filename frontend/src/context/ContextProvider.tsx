import React, { useReducer } from 'react';

interface IUserRoom {
  id: number;
  // user: {}
}

// interface IUserRoomContext extends IUserRoom {
//   updateFavourite: () => void;
// }

// const initialState = { count: 0 };

// function reducer(state, action) {
//   switch (action.type) {
//     case 'increment':
//       return { count: state.count + 1 };
//     case 'decrement':
//       return { count: state.count - 1 };
//     default:
//       throw new Error();
//   }
// }

export const UserRoomContext = React.createContext<IUserRoom>({} as IUserRoom);

const UserRoom: React.FC = ({ children }) => {
  // const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserRoomContext.Provider value={{ id: 1 }}>
      {children}
    </UserRoomContext.Provider>
  );
};

export default UserRoom;
