import React from 'react';

interface IChatProps {
  chat: string[];
}

const Chat: React.FC<IChatProps> = ({ chat }) => {
  return (
    <div>
      {chat.map((message: string, index: number) => {
        return <p key={index}>{message}</p>;
      })}
    </div>
  );
};

export default Chat;
