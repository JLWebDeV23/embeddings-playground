import React, { useState } from "react";
import InputBox from "@/app/components/InputBox/InputBox";
import ModelSelector from "@/app/components/ModelSelector";
import { type Model, type StringInterpolation } from "@/app/utils/interfaces";

interface ModelCompareProps {
    handleGoClick: ({
        newSystemMessage,
        interpolations,
    }: {
        newSystemMessage: string;
        interpolations: StringInterpolation[];
    }) => void;
    selectedModels: Model[];
    setSelectedModels: (models: Model[]) => void;
    setSystemMessageInUserPrompt: (message: string) => void;
}

/* 
    This component is used to select the initial model for the chat and set the system message.
*/
export default function ModelCompare({
    handleGoClick,
    setSelectedModels,
    setSystemMessageInUserPrompt,
}: ModelCompareProps) {
    const [systemMessage, setSystemMessage] = useState<string>("");

    const handleChange = (model: Model) => {
        setSelectedModels([model]);
    };

    const submitSysMessage = () => {
        setSystemMessage(systemMessage);
    };

    return (
        <div className="flex flex-col bg-card p-3 rounded-md">
            <h1 className="font-bold text-xl">Model Compare</h1>
            <div className="divider"></div>
            <div className="flex gap-3 flex-wrap">
                <ModelSelector
                    placeholder="Select the initial model"
                    label="Initial model"
                    onChange={handleChange}
                />
            </div>
            <div className="flex gap-3 pt-3 items-end">
                <InputBox
                    inputText={"System Message"}
                    isButtonVisabled
                    value={systemMessage}
                    handleInput={(e) => {setSystemMessage(e.target.value); setSystemMessageInUserPrompt(e.target.value)}}
                    onSubmit={submitSysMessage}
                />
                <button
                    className="btn btn-lg"
                    onClick={() =>
                        handleGoClick({
                            newSystemMessage: systemMessage,
                            interpolations: [],
                        })
                    }
                >
                    GO
                </button>
            </div>
        </div>
    );
}
