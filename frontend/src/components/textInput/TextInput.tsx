import React from 'react';
import { InputTypes } from '../../types';
interface IProps {
  type?: InputTypes;
  placeholder?: string;
  inputValue: string;
  cb: (e: string) => void;
}

const TextInput: React.FC<IProps> = ({
  type = 'text',
  placeholder = '',
  inputValue,
  cb,
  children,
}) => {
  return (
    <>
      <label>
        {children}
        <input
          type={type}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => cb(e.target.value)}
        />
      </label>
    </>
  );
};

export default TextInput;
