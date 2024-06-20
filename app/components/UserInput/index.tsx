import React, { useState } from "react";
import InputBox from "../InputBox/InputBox";
import useModelData from "@/app/hooks/useModelData";

export default function UserInput({
    isUserInputDisabled = false,
    className,
    placeholder = "User Message",
    systemMessage = "",
    ...rest
}: {
    placeholder?: string;
    isUserInputDisabled?: boolean;
    systemMessage?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
    const [inputValue, setInputValue] = useState<string>("");
    const showAlert = false;

    const { handleAddResponseClick } = useModelData();

    const isButtonDisabled = inputValue.length === 0;

    return (
        <div
            className={`flex flex-col bg-card p-3 rounded-xl ${className}`}
            {...rest}
        >
            <InputBox
                onSubmit={(value: string) => {
                    handleAddResponseClick(value);
                    setInputValue("");
                    // chatcompletion and display to model one => add to modelsData
                    // chatcompletion of value using selected models and push both value to user and the derived completion to the ModelsData
                }}
                value={inputValue}
                handleInput={(e) => setInputValue(e.target.value)}
                isButtonDisabled={isButtonDisabled}
                btnName="Add"
                inputText={placeholder}
                isUserInputDisabled={isUserInputDisabled}
                showAlert={showAlert}
                btnStyle={
                    isButtonDisabled
                        ? "cursor-not-allowed rounded-none rounded-r-lg h-full translate-x-[15%]"
                        : "text-lime-50 cursor-pointer bg-emerald-300 rounded-none rounded-r-lg h-full translate-x-[15%] "
                }
            />
        </div>
    );
}
