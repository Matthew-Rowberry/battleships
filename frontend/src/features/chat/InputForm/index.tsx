import React, { useContext } from 'react';
import Button from '../../../components/button/Button';
import TextInput from '../../../components/textInput/TextInput';
import { UserRoomContext } from '../../../context/userRoomProvider/UserRoomProvider';
import { InputTypes } from '../../../types';

interface ILogin {
  inputLabel: string;
  inputType?: InputTypes;
  inputPlaceholder: string;
  inputValue: string;
  inputCb: (e: any) => void;
  btnDisabled: boolean;
  btnCb: () => void;
  btnText: string;
}

const InputForm: React.FC<ILogin> = ({
  inputLabel,
  inputPlaceholder,
  inputValue,
  inputCb,
  btnDisabled,
  btnCb,
  btnText,
}) => {
  const context = useContext(UserRoomContext);
  console.log(context);

  return (
    <form>
      <TextInput
        placeholder={inputPlaceholder}
        inputValue={inputValue}
        cb={inputCb}
      >
        {inputLabel}
      </TextInput>

      <Button disabled={btnDisabled} cb={btnCb} textValue={btnText} />
    </form>
  );
};

export default InputForm;
