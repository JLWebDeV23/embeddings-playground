import React, { useState } from "react";
import InputBox from "@/app/components/InputBox/InputBox";
import ModelSelector from "@/app/components/ModelSelector";

import { EditStringInterpoplations } from "@/app/components/Modal/EditStringInterpolations";
import useModelData from "@/app/hooks/useModelData";
import useSystemMessage from "@/app/hooks/useSystemMessage";
import { Model } from "@/app/utils/interfaces";

/* 
    This component is used to select the initial model for the chat and set the system message.
*/
export default function ModelCompare() {
    const { systemMessage, handleSystemMessage } = useSystemMessage();

    const { handleGoClick, models, handleModelsAction } = useModelData();

    const handleModelSelection = (model: Model) => {
        handleModelsAction({ action: "set_initial", model: model });
    };

    return (
        <div className="flex flex-col bg-card rounded-md">
            <div className="flex flex-wrap justify-between items-center gap-3 p-3 border-b-2 border-surface">
                <h1 className="font-bold text-xl whitespace-nowrap">
                    Model Compare
                </h1>
                <EditStringInterpoplations />
            </div>
            <div className="flex flex-col p-3">
                <div className="flex flex-col gap-3 flex-wrap">
                    <ModelSelector
                        placeholder="Select the initial model"
                        label="Initial model"
                        selectedModels={models}
                        onChange={handleModelSelection}
                        className="w-full max-w-64"
                    />
                </div>
                <div className="flex gap-3 pt-3 items-end">
                    <InputBox
                        inputText={"System Message"}
                        isButtonVisabled
                        value={systemMessage}
                        handleInput={(e) => {
                            handleSystemMessage(e.target.value);
                        }}
                        onSubmit={handleSystemMessage}
                    />
                    <button
                        className="btn btn-lg"
                        onClick={() =>
                            handleGoClick({
                                newSystemMessage: systemMessage,
                            })
                        }
                    >
                        GO
                    </button>
                </div>
            </div>
        </div>
    );
}
