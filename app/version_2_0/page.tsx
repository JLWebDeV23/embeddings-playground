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
    const [models, setModels] = useState<Model[]>([]);
    const [systemMessage, setSystemMessage] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [apiModelData, setapiModelData] = useState<ModelData[][]>([[]]);

    const modelData: ModelData[][] = resolveModelData(models, apiModelData);

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

    const handleModelAction: ModelsActionFunction = ({
        action,
        index = models.length - 1,
        model,
    }) => {
        switch (action) {
            case "add":
                if (!model) throw new Error("Model is required");
                setModels([...models, model]);

                /* type CreateNewModelDataProps = {
                    modelData: ModelData[][];
                    newModelData: ModelData;
                    systemMessage: string;
                    stringInterpolations: StringInterpolations[];
                }; */

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
                    console.log(response);
                    setapiModelData(() => response);
                });

                break;
            case "pop":
                setModels(() => [
                    ...models.slice(0, index),
                    ...models.slice(index + 1),
                ]);
                setapiModelData((prev) => {
                    const newModelData = [...prev];
                    newModelData.forEach((interpolationAnswer) => {
                        interpolationAnswer.splice(index, 1);
                    });
                    return newModelData;
                });
                break;
            case "lock":
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

    return (
        <>
            <div className="m-5 gap-3 flex flex-col flex-1 ">
                <ModelCompare
                    handleGoClick={handleGoClick}
                    selectedModels={models}
                    setSelectedModels={setModels}
                    setSystemMessageInUserPrompt={setSystemMessage}
                />
                {models.length > 0 ? (
                    modelData.map((obj, index) => (
                        <ModelAnswerGroup
                            key={index}
                            answers={obj}
                            isLoading={isLoading}
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
                />
            </div>
        </>
    );
};

export default Version_2_0;
