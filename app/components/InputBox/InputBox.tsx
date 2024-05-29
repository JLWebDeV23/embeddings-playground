import React, { useState } from "react";
import styles from "./InputBox.module.css";

import { ModelsData } from "@/app/page/ModelCompare/ModelCompare";

type InputBoxProps = {
  btnName?: string;
  InputText: string;
  btnStyle?: string;
  onClick?: (value: string) => void;
  onValueChange?: (value: string) => void;
  isButtonDisabled?: boolean;
};

const InputBox: React.FC<InputBoxProps> = ({
  btnName,
  InputText,
  btnStyle,
  onClick,
  onValueChange,
  isButtonDisabled,
}) => {
  const [value, setValue] = useState<string>("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  const handleClick = (e: React.FormEvent) => {
    try {
      if (onClick) {
        onClick(value);
      }
    } catch (error) {
      console.error("Error in onClick:", error);
    }
    setValue("");
  };
  return (
    <div className={styles.container}>
      <div className={styles.entryArea}>
        <input
          className={styles.input}
          type="text"
          value={value}
          onChange={handleOnChange}
          required
        />
        <div className={styles.labelLine}>{InputText}</div>
        {!isButtonDisabled && (
          <button
            className={`btn absolute right-2 border-1 border-slate-600 z-[1111] bg-indigo-500 opacity-75 text-white  ${btnStyle}`}
            onClick={handleClick}
          >
            {btnName}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputBox;
