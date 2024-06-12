import React, { useState } from "react";
import styles from "./InputBox.module.css";
import { ModelsData } from "@/app/pages/ModelCompare/ModelCompare";
import AlertModal from "../AlertModal/AlertModal";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";

type InputBoxProps = {
  btnName?: string;
  inputText: string;
  btnStyle?: string;
  onClick?: (value: string) => void;
  onValueChange?: (value: string) => void;
  isButtonVisabled?: boolean;
  isButtonDisabled?: boolean;
  showAlert?: boolean;
  isUserInputDisabled?: boolean;
};

const InputBox: React.FC<InputBoxProps> = ({
  btnName,
  inputText,
  btnStyle,
  onClick,
  onValueChange,
  isButtonVisabled,
  isButtonDisabled,
  isUserInputDisabled,
  showAlert,
}) => {
  const [value, setValue] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
  // Todo: fix on disable set the text color slate-600
  return (
    <div className={styles.container}>
      <div className={` ${styles.entryArea}`}>
        <input
          className={`overflow-hidden ${styles.input} ${isUserInputDisabled ? 'text-slate-600' : ''}`}
          type="text"
          value={value}
          onChange={handleOnChange}
          required
          disabled={isUserInputDisabled}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClick(e);
            }
          }}
        />
        <div className={styles.labelLine}>{inputText}</div>
        {!isButtonVisabled && (
          <Button
            disabled={isButtonDisabled}
            className={`btn absolute right-2 border-1 border-white z-[1111] bg-emerald-300 opacity-75 text-white hover:bg-emerald-200 ${btnStyle}`}
            onClick={handleClick}
            onPress={onOpen}
          >
            {btnName}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InputBox;
