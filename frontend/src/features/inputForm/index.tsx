import React from 'react';
import Button from '../../components/button';
import TextInput from '../../components/textInput';
import { InputTypes } from '../../types';

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
