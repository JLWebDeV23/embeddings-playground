"use client";
import React, { useState } from "react";
import {
    Message,
    Model,
    ModelData,
    ModelsActionFunction,
    StringInterpolation,
    StringInterpolations,
} from "@/app/utils/interfaces";

import ModelCompare from "../components/ModelCompare";
import UserInput from "../components/UserInput";
import ModelAnswerGroup from "../components/ModelAnswer/ModelAnswerGroup";

import { insertUserPrompt, go, createNewModelData } from "../utils/api";

const newModelData = (model: Model, locked = false) => {
    return {
        model: model.model,
        subModel: model.subModel,
        messages: [] as Message[],
        locked: locked,
    };
};

/* 
  Function to build the modelData array from the api response but synchronised with the models array
*/
const resolveModelData = (
    models: Model[],
    modelData: ModelData[][],
    numberOfInterpolations = 1
) => {
    return Array.from({ length: numberOfInterpolations }, (_, index) => {
        return models.map((model, modelIndex) => {
            return (
                modelData[index]?.[modelIndex] ||
                newModelData(model, modelIndex === 0)
            );
        });
    });
};

const Version_2_0 = () => {
    /* Array of selected models */
    const [models, setModels] = useState<Model[]>([]);
    const [systemMessage, setSystemMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // Set the loading animation on the last one
    const [isLastLoading, setIsLastLoading] = useState<boolean>(false);

    /* Answers from the api */
    const [apiModelData, setapiModelData] = useState<ModelData[][]>([[]]);

    /* Value recalculated when either the model Array or the apiModelData matrix changes */
    const modelData: ModelData[][] = resolveModelData(models, apiModelData);

    // useEffect(() => {}, [])

    /* function to handle a click on the go button (in ModelCompare) */
    const handleGoClick = ({
        newSystemMessage,
        interpolations,
    }: {
        newSystemMessage: string;
        interpolations: StringInterpolation[];
    }) => {
        setSystemMessage(newSystemMessage);

        if (models.length === 0) {
            console.log("No models selected");
            return;
        }
        setIsLoading(true);
        go({
            modelData: modelData,
            systemMessage: newSystemMessage,
            stringInterpolations: [{ list: interpolations }],
        }).then((response) => {
            setapiModelData(response);
            console.log(response);
            setIsLoading(false);
        });
    };

    /* function to handle a click on the add button (in UserInput) */
    const handleAddResponseClick = (value: string) => {
        if (models.length === 0) {
            console.log("No models selected");
            return;
        }
        console.log("systemMessage", systemMessage);

        // setSystemMessage(systemMessage)
        setIsLoading(true);
        insertUserPrompt({
            modelData: modelData,
            userPrompt: value,
            systemMessage: systemMessage,
            stringInterpolations: [
                {
                    list: [
                        {
                            key: 0,
                            variable: "name",
                            field: "Joey",
                        },
                    ],
                },
            ],
        }).then((response) => {
            if (response) {
                console.log(response);
                setapiModelData(response);
            }
            setIsLoading(false);
        });
    };

    /* 
        function to handle model actions in the ModelAnswerGroup component 
        @param action: "add" | "pop" | "lock" - action to perform on the models array
        @param index: number - index of the model in the models array
        @param model: Model - model to add to the models array
    */
    const handleModelAction: ModelsActionFunction = ({
        action,
        index = models.length - 1,
        model,
    }) => {
        switch (action) {
            case "add":
                // Add the model to the end of the models array
                if (!model) throw new Error("Model is required");
                setModels([...models, model]);
                setIsLastLoading(true);
                createNewModelData({
                    modelData: modelData,
                    newModelData: {
                        model: model.model,
                        subModel: model.subModel,
                        messages: [],
                        locked: false,
                    },
                    systemMessage: systemMessage,
                    stringInterpolations: [{ list: [] }],
                }).then((response) => {
                    setapiModelData(() => response);
                    setIsLastLoading(false);
                });

                break;
            case "pop":
                // Remove the model at index from the models array

                if (index === 0) {
                    setModels([]);
                    setapiModelData([[]]);
                    break;
                }

                setModels(() => [
                    ...models.slice(0, index),
                    ...models.slice(index + 1),
                ]);
                // Remove the model at index from the apiModelData matrix
                setapiModelData((prev) => {
                    const newModelData = [...prev];
                    newModelData.forEach((interpolationAnswer) => {
                        interpolationAnswer.splice(index, 1);
                    });
                    return newModelData;
                });
                break;
            case "lock":
                // Toggle the lock status of the model at index
                setapiModelData(() => {
                    const newModelData = modelData.map((interpolationAnswer) =>
                        interpolationAnswer.map((modelData, i) => {
                            if (i === index) {
                                return {
                                    ...modelData,
                                    locked: !modelData.locked,
                                };
                            }
                            return modelData;
                        })
                    );
                    return newModelData;
                });
                break;
            default:
                break;
        }
    };

    /* function to handle a model selection in the ModelCompare component */
    const handleSelectModel = (model: Model) => {
        setModels([model]);
        setapiModelData([[]]);
    };

    console.log("models", models);

    return (
        <>
            <div className="m-5 gap-3 flex flex-col flex-1 ">
                <ModelCompare
                    handleGoClick={handleGoClick}
                    selectedModels={models}
                    onSelectModel={handleSelectModel}
                    setSystemMessageInUserPrompt={setSystemMessage}
                />
                {models.length > 0 ? (
                    modelData.map((obj, index) => (
                        <ModelAnswerGroup
                            key={index}
                            answers={obj}
                            isLoading={isLoading}
                            isLastLoading={isLastLoading}
                            onModelsAction={handleModelAction}
                        />
                    ))
                ) : (
                    <div className="flex justify-center items-center opacity-50 flex-1 min-h-20">
                        Select a model to start
                    </div>
                )}
            </div>
            <div className="sticky bottom-0 p-5 gap-3 flex flex-col  backdrop-blur-md">
                <UserInput
                    handleAddResponseClick={handleAddResponseClick}
                    className="pt-4 w-full"
                    isUserInputDisabled={models.length === 0}
                />
            </div>
        </>
    );
};

export default Version_2_0;
