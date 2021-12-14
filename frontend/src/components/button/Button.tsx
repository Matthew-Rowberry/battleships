import React from 'react';

interface IButton {
  cb: () => void;
  disabled: boolean;
  textValue: string;
}

const Button: React.FC<IButton> = ({ disabled, cb, textValue }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        cb();
      }}
    >
      {textValue}
    </button>
  );
};

export default Button;
