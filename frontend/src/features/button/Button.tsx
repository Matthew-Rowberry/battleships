import React from 'react';

interface IButton {
  cb: () => void;
  disabled: boolean;
}

const Button: React.FC<IButton> = ({ disabled, cb, children }) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        cb();
      }}
    >
      {children}
    </button>
  );
};

export default Button;
