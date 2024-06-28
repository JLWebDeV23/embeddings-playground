import React from "react";
import styles from "./InputBox.module.css";

import { Button } from "@nextui-org/button";

type InputBoxProps = {
    inputText: string;
    onSubmit?: (value: string) => void;
    value?: string;
    handleInput?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    btnName?: string;
    btnStyle?: string;
    isButtonVisabled?: boolean;
    isButtonDisabled?: boolean;
    showAlert?: boolean;
    isUserInputDisabled?: boolean;
};

const InputBox = ({
    inputText,
    onSubmit = () => {},
    value = "",
    handleInput = () => {},
    btnName = "Submit",
    ...props
}: InputBoxProps) => {
    // Todo: fix on disable set the text color slate-600

    return (
        <div className={styles.container}>
            <div className={`bg-content1 rounded-lg ${styles.entryArea}`}>
                <input
                    className={`overflow-hidden ${styles.input} ${
                        props.isUserInputDisabled ? "opacity-25" : ""
                    }`}
                    type="text"
                    value={value}
                    onInput={handleInput}
                    required
                    disabled={props.isUserInputDisabled}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            onSubmit(value);
                        }
                    }}
                />
                <div
                    className={`${
                        props.isUserInputDisabled ? "opacity-10" : ""
                    } ${styles.labelLine}`}
                >
                    {props.isUserInputDisabled
                        ? "Please select a model to start"
                        : inputText}
                </div>
                {!props.isButtonVisabled && (
                    <Button
                        disabled={props.isButtonDisabled}
                        className={`btn absolute right-2 border-1 border-white z-[1111] bg-emerald-300 opacity-75 text-white hover:bg-emerald-200 ${props.btnStyle}`}
                        onClick={() => onSubmit(value)}
                    >
                        {btnName}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default InputBox;
