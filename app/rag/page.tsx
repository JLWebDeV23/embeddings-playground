"use client";

import { useRef, useState } from "react";
import ModelAnswer from "../components/ModelAnswer";
import ModelSelector from "../components/ModelSelector";
import SystemMessageBox from "../components/SystemMessageBox";
import UserInput from "../components/UserInput";
import { useApiKeys } from "../hooks/useApiKeys";

import useModelData from "../hooks/useModelData";
import useSystemMessage from "../hooks/useSystemMessage";
import { rag, searchSimilarities, setupQdrant } from "../utils/collection";
import { Message, Model } from "../utils/interfaces";
import { SourcesModal } from "./components/SourcesModal";

function RagInputFooter({
    selectedCollection,
    handleSelectCollection,
    resetMessages,
}: {
    selectedCollection: string;
    handleSelectCollection: (collection: string) => void;
    resetMessages: () => void;
}) {
    const { models, handleModelsAction } = useModelData();

    const handleModelSelection = (model: Model) => {
        resetMessages();
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

            <SourcesModal
                selectedCollection={selectedCollection}
                handleSelectCollection={handleSelectCollection}
            />
        </>
    );
}

export default function Page() {
    const [selectedCollection, setSelectedCollection] = useState<string>("");
    const { models } = useModelData();

    const [messages, setMessages] = useState<Message[]>([]);

    const resultDivRef = useRef<HTMLDivElement>(null);

    const updateMessages = (response: string) => {
        setMessages((prev) => {
            console.log(prev);
            const [lastMessage, ...oldMessages] = prev.slice().reverse();
            if (lastMessage.role !== "assistant") {
                return [...prev, { role: "assistant", content: response }];
            }
            return [
                ...oldMessages.reverse(),
                { role: "assistant", content: response },
            ];
        });
    };

    const handleResetMessages = () => {
        setMessages([]);
    };

    const { apiKeys, QdrantDBURL } = useApiKeys();
    const { systemMessage } = useSystemMessage();

    const handleSendMessage = async (inputValue: string) => {
        // use result to display similarities
        const result = await searchSimilarities(inputValue, selectedCollection);
        const model = {
            model: models[0].model,
            subModel: models[0].subModel,
            apiKey: apiKeys,
        };
        setMessages((prev) => [...prev, { role: "user", content: inputValue }]);
        // and call rag to and it will set the streamResponse to your component
        await rag(
            model,
            inputValue,
            systemMessage,
            messages,
            result!,
            updateMessages
        );
    };
    setupQdrant(
        QdrantDBURL,
        apiKeys.find((k) => k.name === "QdrantDB")?.apiKey || ""
    );
    return (
        <div className="gap-3 flex flex-col flex-1 justify-between">
            <div ref={resultDivRef} className="flex flex-col px-5 flex-1 gap-5">
                <SystemMessageBox hideInterpolations hideGoButton />
                {models.length === 0 ? (
                    <div className="flex justify-center items-center opacity-50 min-h-20 h-full rounded-md">
                        Select a model below to start
                    </div>
                ) : (
                    <div className="h-fit">
                        <ModelAnswer
                            onClose={() => handleResetMessages()}
                            answer={{
                                model: models[0].model,
                                subModel: models[0].subModel,
                                messages: messages,
                                locked: true,
                                apiKey: apiKeys,
                            }}
                        />
                    </div>
                )}
            </div>
            <div className="flex justify-center w-full sticky bottom-0 px-5 pt-5 bg-gradient-to-t from-background/90 to-transparent">
                <UserInput
                    handleSendMessage={handleSendMessage}
                    className="flex flex-col w-full max-w-screen-lg backdrop-blur-md rounded-b-none"
                    modelSelectorPlaceholder="Select a model to start"
                    isUserInputDisabled={selectedCollection === ""}
                    placeholder={
                        selectedCollection
                            ? "Type your message"
                            : "Please select a source to start"
                    }
                >
                    <RagInputFooter
                        handleSelectCollection={(collection) =>
                            setSelectedCollection(collection)
                        }
                        selectedCollection={selectedCollection}
                        resetMessages={handleResetMessages}
                    />
                </UserInput>
            </div>
        </div>
    );
}
