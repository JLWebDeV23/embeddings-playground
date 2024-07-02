"use client";
import UserInput from "../components/UserInput";
import SystemMessageBox from "../components/SystemMessageBox";
import ModelSelector from "../components/ModelSelector";
import useModelData from "../hooks/useModelData";
import { Model } from "../utils/interfaces";
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";

function RagInputFooter() {
    const { models, handleModelsAction } = useModelData();

    const handleModelSelection = (model: Model) => {
        handleModelsAction({ action: "set_initial", model: model });
    };
    return (
        <>
            <ModelSelector
                placeholder="Select a model"
                aria-label="initial model"
                selectedModels={models}
                onChange={handleModelSelection}
                className="w-full max-w-64"
                size="sm"
                variant="flat"
            />
            <Autocomplete
                aria-label="source"
                placeholder="Select a source"
                className="w-full max-w-64"
                size="sm"
                variant="flat"
            >
                <AutocompleteItem key="source1" value="source1">
                    Source 1
                </AutocompleteItem>
            </Autocomplete>
            <Button
                size="sm"
                onPress={() => alert("to be implemented")}
                variant="flat"
            >
                Add a source
            </Button>
        </>
    );
}

export default function Page() {
    return (
        <div className="gap-3 flex flex-col flex-1 justify-between">
            <div className="px-5 flex-1">
                <SystemMessageBox />
                <div className="flex justify-center items-center opacity-50 min-h-20 h-full rounded-md">
                    Select a model below to start
                </div>
            </div>
            <div className="flex justify-center w-full sticky bottom-0 px-5 pt-5 bg-gradient-to-t from-background/90 to-transparent">
                <UserInput
                    handleSendMessage={() => alert("to be implemented")}
                    className="flex flex-col w-full max-w-screen-lg backdrop-blur-md rounded-b-none"
                    modelSelectorPlaceholder="Select a model to start"
                >
                    <RagInputFooter />
                </UserInput>
            </div>
        </div>
    );
}
