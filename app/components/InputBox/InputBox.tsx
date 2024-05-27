import React, { useState } from "react";
import styles from "./InputBox.module.css";

import { ModelsData } from "@/app/page/ModelCompare/ModelCompare";

type InputBoxProps = {
  btnName: string;
  InputText: string;
  btnStyle?: string;
  onClick: (value: string) => void;
};

const InputBox: React.FC<InputBoxProps> = ({
  btnName,
  InputText,
  btnStyle,
  onClick,
}) => {
  const [value, setValue] = useState<string>("");
  const handleClick = (e: React.FormEvent) => {
    try {
      onClick(value);
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
          onChange={(e) => {
            setValue(e.target.value);
          }}
          required
        />
        <div className={styles.labelLine}>{InputText}</div>
        <button
          className={`btn absolute right-2 border-1 border-slate-600 z-[1111] bg-indigo-500 opacity-75 text-white  ${btnStyle}`}
          onClick={handleClick}
        >
          {btnName}
        </button>
      </div>
    </div>
  );
};

export default InputBox;
